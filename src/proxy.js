import { NextResponse } from "next/server";

const COOKIE_NAME = "swagger_session";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only guard /api-docs routes (not the login page itself)
  if (
    pathname.startsWith("/api-docs") &&
    !pathname.startsWith("/api-docs/login")
  ) {
    const cookie = request.cookies.get(COOKIE_NAME);

    if (!cookie?.value) {
      // Not authenticated → redirect to login
      const loginUrl = new URL("/api-docs/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api-docs/:path*"],
};
