import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes - redirect to sign-in if not authenticated
  if (pathname.startsWith("/dashboard") && !isAuth) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
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
