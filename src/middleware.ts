import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;
    const isLoggedIn = request.cookies.get("token");

    if (pathname.startsWith("/account") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}
// Define which paths this middleware should be applied to
export const config = {
    matcher: "/account/:path*",
};
