import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  // Public routes that don't require authentication
  const publicRoutes = ["/auth", "/api/auth"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!session && !isPublicRoute) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("toast", "auth-required");
    return NextResponse.redirect(url);
  }

  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
