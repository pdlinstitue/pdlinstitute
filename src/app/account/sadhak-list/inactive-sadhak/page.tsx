import { BASE_API_URL } from '@/app/utils/constant';
import { cookies } from 'next/headers';
import React from 'react';
import InActiveSadhak from './InActiveSadhak';

const InActiveSadhakList : React.FC = async () => {

  const cookieStore = await cookies();
  const userCookie = cookieStore.get('loggedInUser')?.value;
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!userCookie) {
    return <div>No user info found in cookies.</div>;
  }

  let role = '';
  try {
    const parsed = JSON.parse(userCookie);
    role = parsed.usrRole;
  } catch (error) {
    console.error('Error parsing cookie:', error);
    return <div>Invalid user cookie format.</div>;
  }

  let inActiveUserList = [];
  try {
    const res = await fetch(`${BASE_API_URL}/api/inactive-users?usrRole=${role}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`, // ✅ manually pass cookie
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await res.json();
    inActiveUserList = data.InActiveSdkList;
  } catch (err) {
    console.error('Fetch error:', err);
    return <div>Failed to fetch users.</div>;
  }

  return (
    <div>
      <InActiveSadhak inActiveUserList={inActiveUserList} />
    </div>
  );
};

export default InActiveSadhakList;
