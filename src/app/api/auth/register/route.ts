import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, turnstileToken } = body;

    // Rate Limiting
    const { signupRateLimit, getRateLimitHeaders, formatTimeRemaining, getClientIP: getIP } = await import('@/lib/rate-limit');
    const ip = await getIP();
    const { success, limit, remaining, reset } = await signupRateLimit.limit(ip);
    const rlHeaders = getRateLimitHeaders(limit, remaining, reset);

    if (!success) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${formatTimeRemaining(reset)}.` },
        { status: 429, headers: rlHeaders }
      );
    }

    // Verify Turnstile
    if (!turnstileToken) {
      console.warn('[SECURITY] Registration without Turnstile token');
      return NextResponse.json(
        { error: "Verification required" },
        { status: 400 }
      );
    }

    const { verifyTurnstileToken, getClientIP } = await import('@/lib/turnstile');
    const clientIP = getClientIP(request);
    const verification = await verifyTurnstileToken(turnstileToken, clientIP);

    if (!verification.success) {
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
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
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
      await sendVerificationEmail(email, token, name || "there");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails - user can resend later
    }

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
