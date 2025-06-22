import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();

const ACCESS_TOKEN_SECRET = encoder.encode(process.env.ACCESS_TOKEN_SECRET!);
const REFRESH_TOKEN_SECRET = encoder.encode(process.env.REFRESH_TOKEN_SECRET!);

import type { JWTPayload } from 'jose';

export async function generateAccessToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${process.env.LOGIN_EXPIRES}sec`)
    .sign(ACCESS_TOKEN_SECRET);
}

export async function generateRefreshToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
  return payload;
}