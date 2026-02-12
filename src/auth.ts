import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const turnstileToken = credentials.turnstileToken as string;

        // Verify Turnstile
        if (!turnstileToken) {
          throw new Error("Verification required");
        }

        const { verifyTurnstileToken } = await import('@/lib/turnstile');
        const verification = await verifyTurnstileToken(turnstileToken);

        if (!verification.success) {
          throw new Error(verification.error || "Bot verification failed");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("EmailNotVerified");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  logger: process.env.NODE_ENV === "development" ? {
    error: (code, ...message) => {
      console.error(`[AUTH_ERROR] ${code}:`, ...message);
    },
    warn: (code, ...message) => {
      console.warn(`[AUTH_WARN] ${code}:`, ...message);
    },
    debug: (code, ...message) => {
      console.log(`[AUTH_DEBUG] ${code}:`, ...message);
    },
  } : undefined,
});
