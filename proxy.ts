import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // Redirect logged-in users away from auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      if (token) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
        if (role === "LECTURER") return NextResponse.redirect(new URL("/lecturer", req.url));
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Admin-only routes
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        if (role === "LECTURER") return NextResponse.redirect(new URL("/lecturer", req.url));
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Lecturer + Admin routes
    if (pathname.startsWith("/lecturer")) {
      if (role !== "LECTURER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes — no auth required
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/campuses") ||
          pathname.startsWith("/api/courses") ||
          pathname === "/"
        ) {
          return true;
        }
        // All other routes require auth
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lecturer/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/profile/:path*",
  ],
};
