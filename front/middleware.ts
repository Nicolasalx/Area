import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth", "/api/auth"];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === "/",
  );

  // Get auth token from cookie
  const authToken = request.cookies.get("auth-token");

  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (authToken && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/workflows", request.url));
  }

  // Clone the request headers and add Authorization header if token exists
  const requestHeaders = new Headers(request.headers);
  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken.value}`);
  }

  // Return response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
