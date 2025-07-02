import { BASE_API_URL } from '@/app/utils/constant';

export async function fetchPaginatedSadhaks(page: number, size: number, search?: string, accessToken?: string, refreshToken?: string, role?: string) {
  const res = await fetch(`${BASE_API_URL}/api/users/list`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    },
    body: JSON.stringify({ usrRole: role, pageNumber: page, pageSize: size, search }),
  });

  const data = await res.json();
  return data;
}