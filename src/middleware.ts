import { NextResponse, NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/unauthorized"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const roleType = request.cookies.get("loggedInUserRole")?.value;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (pathname.startsWith("/account") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //If user is authenticated but doesn't have roleId, deny access
  if (!roleType) {
    return NextResponse.redirect(new URL("/account/unauthorized", request.url));
  }

  try {
    // const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    // const res = await fetch(`${baseUrl}/api/role-permissions/${roleType}`);
    // const data = await res.json();
    // const allowedUrls: string[] = data.allowedUrls || [];

    // // If the current path is not allowed for the user's role, redirect
    // if (!allowedUrls.includes(pathname)) {
    //   return NextResponse.redirect(new URL("/account/unauthorized", request.url));
    // }

     return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/account/unauthorized", request.url));
  }
}

// Apply middleware only to `/account/*` routes
export const config = {
  matcher: "/account/:path*",
};