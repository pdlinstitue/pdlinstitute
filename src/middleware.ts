import { NextResponse, NextRequest } from "next/server";
import { verifyApiToken } from "./app/utils/verifyApiToken";
import { decompressFromEncodedURIComponent } from 'lz-string';

const PUBLIC_PATHS = ["/login", "/account/unauthorized"];
const PUBLIC_API_PATHS = [
  "/api/auth/login", 
  "/api/auth/logout", 
  "/api/categories", 
  "/api/marketting-courses", 
  "/api/marketting-courses/:CoSlug/view-marketting-course",
  "/api/batch-by-marketting-course-id/:CorId/upcoming-batches"
];

function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PATHS.some(pattern => {
    const regex = new RegExp(
      "^" + pattern
        .replace(/:[^/]+/g, "[^/]+") // replace dynamic segments like :CoSlug
        .replace(/\//g, "\\/") + "$"
    );
    return regex.test(pathname);
  });
}

export async function middleware(request: NextRequest) {  
  const { pathname } = request.nextUrl;
  const encryptedAccess = request.cookies.get("accessToken")?.value;
  const encryptedRefresh = request.cookies.get("refreshToken")?.value;
  const allowedUrlsCookie = request.cookies.get("allowedUrls")?.value;
  const allowedUrls: string[] = allowedUrlsCookie ? JSON.parse(decompressFromEncodedURIComponent(allowedUrlsCookie)) : [];

  if (PUBLIC_PATHS.includes(pathname) || isPublicApiPath(pathname)) {
    return NextResponse.next();
  }

  try {
    if (pathname.startsWith("/account")) {
      const matchesAllowedUrl = allowedUrls.some((pattern) => {
        const regex = new RegExp(
          "^" + pattern.replace(/\[.*?\]/g, "[^/]+").replace(/\//g, "\\/") + "$"
        );
        return regex.test(pathname);
      });

      if (!matchesAllowedUrl) {
        return NextResponse.redirect("/account/unauthorized");
      }
    }

    const { user, refreshed, newAccessToken } = await verifyApiToken(
      encryptedAccess,
      encryptedRefresh
    );

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = NextResponse.next();

    if (refreshed && newAccessToken) {
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
      });
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/account/unauthorized", request.url));
  }
}

export const config = {
  matcher: ["/account/:path*", "/api/:path*"],
};