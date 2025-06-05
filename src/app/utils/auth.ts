import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function verifyApiToken() {
    
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) throw new Error('Missing Token');

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT secret');

  return jwt.verify(token, secret);
}
