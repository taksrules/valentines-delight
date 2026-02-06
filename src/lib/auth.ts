import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth/auth.config";

/**
 * Main Auth instance for server-side use in API routes and Server Components.
 * This includes heavyweight dependencies like providers and DB logic.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({

  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Lazy load prisma to avoid initializing it during middleware checks
        const { prisma } = await import("@/lib/prisma");

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
          emailVerified: user.emailVerified,
        } as any;
      },
    }),
  ],
});
