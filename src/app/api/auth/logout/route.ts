import { NextResponse } from 'next/server';

export async function POST() {

  const res = NextResponse.json({ success: true, msg:"Loggedout successfully." }, { status: 200 });

  res.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  res.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return res;
}
