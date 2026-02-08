import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email/resend";

export async function POST(request: Request) {
  const start = Date.now();
  try {
    const body = await request.json();
    const { email, password, name, turnstileToken } = body;
    console.log(`[API/REGISTER] Request for: ${email}`);

    // Rate Limiting
    const { signupRateLimit, getRateLimitHeaders, formatTimeRemaining, getClientIP: getIP } = await import('@/lib/rate-limit');
    const ip = await getIP();
    const { success, limit, remaining, reset } = await signupRateLimit.limit(ip);
    const rlHeaders = getRateLimitHeaders(limit, remaining, reset);

    if (!success) {
      console.warn(`[API/REGISTER] Rate limited: ${email} (${ip})`);
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${formatTimeRemaining(reset)}.` },
        { status: 429, headers: rlHeaders }
      );
    }

    // Verify Turnstile
    if (!turnstileToken) {
      console.warn('[API/REGISTER] ❌ Security failure: Missing Turnstile token');
      return NextResponse.json(
        { error: "Verification required" },
        { status: 400 }
      );
    }

    const { verifyTurnstileToken, getClientIP } = await import('@/lib/turnstile');
    const clientIP = getClientIP(request);
    console.log(`[API/REGISTER] Verifying Turnstile for ${email}...`);
    const verification = await verifyTurnstileToken(turnstileToken, clientIP);

    if (!verification.success) {
      console.warn(`[API/REGISTER] ❌ Security failure: Turnstile rejected ${email} - ${verification.error}`);
      return NextResponse.json(
        { error: verification.error || "Verification failed" },
        { status: 400 }
      );
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn(`[API/REGISTER] ❌ Conflict: User already exists - ${email}`);
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    console.log(`[API/REGISTER] Creating user: ${email}...`);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        passwordHash,
      },
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires,
      },
    });

    // Send verification email
    try {
      console.log(`[API/REGISTER] Sending verification email to ${email}...`);
      await sendVerificationEmail(email, token, name || "there");
    } catch (emailError) {
      console.error("[API/REGISTER] 📧 Email failure:", emailError);
      // Don't fail registration if email fails - user can resend later
    }

    console.log(`[API/REGISTER] ✅ Success in ${Date.now() - start}ms: ${email}`);
    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API/REGISTER] 💥 Server Error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
