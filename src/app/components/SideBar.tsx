"use client";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Loading from '../account/Loading';
import SadhakSideMenu from './SadhakSideMenu';
import AdminSideMenu from './AdminSideMenu';



const SideBar: React.FC = () => {

  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: '',
      usrName: '',
      usrRole: '',
    },
  });
   
  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || '';
      const userName = Cookies.get("loggedInUserName") || '';
      const userRole = Cookies.get("loggedInUserRole") || '';
      setLoggedInUser({
        result: {
          _id: userId,
          usrName: userName,
          usrRole: userRole,
        },
      });
    } catch (error) {
        console.error("Error fetching loggedInUserData.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }
  
  return (
    <div>
      <div className='flex flex-col w-[230px] bg-orange-600 h-screen p-4'>
        <div className='flex gap-2 items-center bg-orange-500 rounded-sm'>
          <Image alt='pdlinstitute' src="/images/pdlLogo.jpg" width={52} height={52}/>
          <p className='text-white font-bold'>PDL INSTITUTE</p>
        </div>
        <div className='flex flex-col gap-2'>
          {(loggedInUser.result.usrRole === 'Sadhak' || loggedInUser.result.usrRole === 'Volunteer') && (
            <SadhakSideMenu />
          )}
          {(loggedInUser.result.usrRole === 'Admin' || loggedInUser.result.usrRole === 'View-Admin') && (
            <AdminSideMenu />
          )}
        </div>
      </div>
    </div>
  )
}

export default SideBar;