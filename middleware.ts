import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // TC-05 (PASSING): Students and lecturers are blocked from admin routes.
    // Expected: non-ADMIN users who visit /admin are redirected to /unauthorized.
    // Actual: works correctly — only ADMIN role can access /admin.
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Lecturers and admins can access /lecturer routes; students cannot.
    if (pathname.startsWith("/lecturer") && token?.role === "STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/lecturer/:path*", "/dashboard/:path*"],
};
