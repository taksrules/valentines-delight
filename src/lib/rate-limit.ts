import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * 1. Journey viewing: 30 views/minute per IP
 */
export const viewRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "ratelimit:view",
});

/**
 * 2. Journey creation: 5 journeys/hour per user ID
 */
export const createJourneyLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:create",
});

/**
 * 3. Photo upload: 20 uploads/hour per user ID
 */
export const uploadPhotoLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  analytics: true,
  prefix: "ratelimit:upload",
});

/**
 * 4. API general: 100 requests/minute per IP
 */
export const apiGeneralLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

/**
 * 5. Signup: 3 accounts/hour per IP
 */
export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:signup",
});

/**
 * Extract client IP address from request headers
 */
export async function getClientIP(): Promise<string> {
  const headerList = await headers();
  const xForwardedFor = headerList.get("x-forwarded-for");
  const xRealIp = headerList.get("x-real-ip");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  
  return xRealIp || "127.0.0.1";
}

/**
 * Helper to format time remaining in a user-friendly way
 */
export function formatTimeRemaining(resetTimestamp: number): string {
  const now = Date.now();
  const diff = Math.max(0, resetTimestamp - now);
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} and ${seconds} second${seconds === 1 ? "" : "s"}`;
  }
  
  return `${seconds} second${seconds === 1 ? "" : "s"}`;
}

/**
 * Get standard rate limit headers for responses
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
) {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
    "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
  };
}
