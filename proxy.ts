/**
 * Next.js Proxy – Route protection
 * Protects dashboard, brands, categories, and products. Redirects unauthenticated
 * users to /login. Redirects authenticated users from /login to /dashboard.
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/brands", "/categories", "/products"] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname.startsWith("/login");

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/brands",
    "/brands/:path*",
    "/categories",
    "/categories/:path*",
    "/products",
    "/products/:path*",
    "/units",
    "/units/:path*",
    "/taxes",
    "/taxes/:path*",
    "/login",
  ],
};
