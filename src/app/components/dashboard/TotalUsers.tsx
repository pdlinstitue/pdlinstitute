"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';


const TotalUsers: React.FC = () => {

  const [totalUsers, setTotalUsers] = useState<number | null>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/users/user-counts`);
        const users = await response.json();
        setTotalUsers(users.activeSdkCount);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className='flex uppercase flex-col gap-3 items-center justify-center p-6'>
        <FaUser className=' text-orange-700' size={54}/> 
        <div className='flex items-center gap-2'>
            <h2 className='font-bold'>Sadhaks:</h2>
            <p>{totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalUsers;
