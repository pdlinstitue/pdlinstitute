import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {

  const refToken = (await cookies()).get("refreshToken")?.value;

  if (!refToken){
    return NextResponse.json({ success: false, msg: "No refresh token" }, { status: 401 });
  } 

  try {

    const payload = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET!);
    const newAccessToken = jwt.sign({ id: (payload as any).id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const res = NextResponse.json({token:newAccessToken, success: true });
    res.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    return res;
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Invalid refresh token" }, { status: 401 });
  }
}
