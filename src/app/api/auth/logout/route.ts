import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function POST() {
  const response = NextResponse.json(
    { success: true, msg: "Logged out successfully." },
    { status: 200 }
  );

  // Clear cookies by setting maxAge = 0
  response.cookies.set("accessToken", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("refreshToken", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("loggedInUser", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}