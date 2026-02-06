import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {

  const start = performance.now();
  const isAuth = !!req.auth;
  const end = performance.now();
  
  if (end - start > 100) {
    console.warn(`[Middleware] Auth check took ${Math.round(end - start)}ms`);
  }

  const { pathname } = req.nextUrl;

  // Protected routes - redirect to sign-in if not authenticated
  if (pathname.startsWith("/dashboard") && !isAuth) {
    return NextResponse.redirect(new URL("/sign-in", "http://127.0.0.1:3000"));
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", "http://127.0.0.1:3000"));
  }



  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
