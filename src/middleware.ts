import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  //   const token = sessionStorage.getItem("GBD-TOKEN");

  //   if (!token) return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!register|api|reset-password|login|form|_next/*|$).*)"],
};
