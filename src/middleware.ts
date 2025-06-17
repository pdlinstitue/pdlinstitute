import { NextResponse, NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/account/unauthorized"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;  
  const userCookie = request.cookies.get('loggedInUser')?.value;

  let parsed: any = {};
  if (userCookie) {
    parsed = JSON.parse(userCookie);
  }

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Deny access if not authenticated
  if (!parsed.usrRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const baseurl = process.env.NEXT_PUBLIC_BASE_API_URL;

  if (!baseurl) {
    console.error("Missing NEXT_PUBLIC_BASE_API_URL in env");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    const res = await fetch(`${baseUrl}/api/role-permissions/${parsed.usrRole}`);
    const data = await res.json();
    const allowedUrls: string[] = data.allowedUrls || [];

    const matchesAllowedUrl = allowedUrls.some((pattern) => {
      const regex = new RegExp(
        "^" + pattern.replace(/\[.*?\]/g, "[^/]+").replace(/\//g, "\\/") + "$"
      );
      return regex.test(pathname);
    });

    // If the current path is not allowed for the user's role, redirect
    if (!matchesAllowedUrl) {
      return NextResponse.redirect(
        new URL("/account/unauthorized", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/account/unauthorized", request.url));
  }
}

// Apply middleware only to /account/* routes
export const config = {
  matcher: "/account/:path*",
};