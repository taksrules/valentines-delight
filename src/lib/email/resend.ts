import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.RESEND_FROM_EMAIL || "notifications@tenderly.app";
const appUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Verify your Tenderly account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; background-color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div style="font-size: 40px; margin-bottom: 20px;">❤️</div>
            <h1 style="font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 10px;">
              Welcome to Tenderly!
            </h1>
            <p style="font-size: 16px; color: #666; line-height: 24px; margin-bottom: 10px;">
              Hi ${name},
            </p>
            <p style="font-size: 16px; color: #666; line-height: 24px; margin-bottom: 30px;">
              Thanks for signing up! Please verify your email address to complete your registration.
            </p>
            <a href="${verifyUrl}" style="display: inline-block; background-color: #e11d48; color: #ffffff; padding: 14px 32px; border-radius: 16px; font-size: 16px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);">
              Verify Email
            </a>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
            <p style="font-size: 12px; color: #ccc; margin-top: 20px;">
              This link expires in 24 hours.
            </p>
            <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #ccc;">
              © 2026 Tenderly. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Reset your Tenderly password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; background-color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div style="font-size: 40px; margin-bottom: 20px;">🔐</div>
            <h1 style="font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 10px;">
              Reset your password
            </h1>
            <p style="font-size: 16px; color: #666; line-height: 24px; margin-bottom: 10px;">
              Hi ${name},
            </p>
            <p style="font-size: 16px; color: #666; line-height: 24px; margin-bottom: 30px;">
              We received a request to reset your password. Click the button below to create a new one.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #e11d48; color: #ffffff; padding: 14px 32px; border-radius: 16px; font-size: 16px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);">
              Reset Password
            </a>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            <p style="font-size: 12px; color: #ccc; margin-top: 20px;">
              This link expires in 1 hour.
            </p>
            <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #ccc;">
              © 2026 Tenderly. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}
