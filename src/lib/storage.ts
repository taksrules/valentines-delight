import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3';

export const SIGNED_URL_EXPIRY = {
  PUBLISHED: 86400, // 24 hours
  DRAFT: 3600,      // 1 hour
};

export const CACHE_TTL = {
  PUBLISHED: 86400, // 24 hours
  DRAFT: 300,       // 5 minutes
};

/**
 * Generates a signed URL with tiered expiration based on journey status.
 * Published/Completed journeys get long-lived URLs to enable effective CDN caching.
 */
export async function getTieredSignedUrl(imageUrl: string | null | undefined, status: string) {
  if (!imageUrl) return imageUrl;
  
  const isPublished = status === 'published' || status === 'completed';
  const expiresIn = isPublished ? SIGNED_URL_EXPIRY.PUBLISHED : SIGNED_URL_EXPIRY.DRAFT;

  try {
    const urlObj = new URL(imageUrl);
    
    // Handle Supabase public storage URLs: /storage/v1/object/public/bucket/key
    if (imageUrl.includes('/storage/v1/object/public/')) {
      const parts = urlObj.pathname.split('/public/');
      if (parts.length > 1) {
        const fullPath = parts[1];
        const pathParts = fullPath.split('/');
        const bucket = pathParts[0];
        const key = pathParts.slice(1).join('/');

        if (bucket && key) {
          const command = new GetObjectCommand({ Bucket: bucket, Key: key });
          return await getSignedUrl(s3Client, command, { expiresIn });
        }
      }
    }
    // Handle S3 backend URLs or direct storage paths
    else if (imageUrl.includes('/storage/v1/s3/')) {
      const s3Match = imageUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
      if (s3Match) {
        const bucket = s3Match[1];
        const key = s3Match[2];
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return await getSignedUrl(s3Client, command, { expiresIn });
      }
    }
  } catch (e) {
    console.error('[Storage] Failed to sign URL:', imageUrl, e);
  }
  
  // Return original URL as fallback
  return imageUrl;
}

/**
 * Returns the appropriate Cache-Control header string based on journey status.
 */
export function getCacheHeaders(status: string) {
  const isPublished = status === 'published' || status === 'completed';
  
  if (isPublished) {
    return {
      'Cache-Control': `public, max-age=${CACHE_TTL.PUBLISHED}, immutable`,
      'CDN-Cache-Control': `max-age=${CACHE_TTL.PUBLISHED}`,
      'X-Cache-Status': 'public',
      'X-Cache-TTL': CACHE_TTL.PUBLISHED.toString(),
    };
  }

  return {
    'Cache-Control': `private, max-age=${CACHE_TTL.DRAFT}, must-revalidate`,
    'CDN-Cache-Control': 'no-store',
    'X-Cache-Status': 'private',
    'X-Cache-TTL': CACHE_TTL.DRAFT.toString(),
  };
}
