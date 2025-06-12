import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

function safeVerify(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export async function verifyApiToken(req?: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const secret = process.env.JWT_SECRET!;


  const decoded = safeVerify(token||"", secret);
  if (decoded) return decoded;

  // Token expired - attempt refresh
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL!;
  const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; '),
    },
  });

  if (!refreshRes.ok) throw new Error('Refresh token invalid or expired');

  const data = await refreshRes.json();
  const newToken = data.token;

  if (!newToken) throw new Error('New token not returned after refresh');

  const newDecoded = safeVerify(newToken, secret);
  if (!newDecoded) throw new Error('Failed to verify new token');

  return newDecoded;
}