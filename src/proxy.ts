// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "hotel_cost_user";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  console.log("[PROXY RUNNING]", pathname, Boolean(sessionCookie));

  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};