'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RxAvatar } from 'react-icons/rx';
import { RiProfileLine } from "react-icons/ri";
import { MdSettingsBrightness } from "react-icons/md";
import { PiFolderLockFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';

const ProfMenu = () => {

  const router = useRouter();
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

  const handleLogOut = () => {
    Cookies.remove("loggedInUserId");
    Cookies.remove("loggedInUserName");
    Cookies.remove("loggedInUserRole");
    Cookies.remove("token");
    toast.success('Logged out successfully');
    router.push('/login');
  }

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }

  return (
    <div className="flex p-4 items-center gap-3 w-auto">
      <div className="w-auto">
        <p>Hello, {loggedInUser.result?.usrName}</p>
      </div>
      <div className="relative group transition-all"> 
        <RxAvatar size={44} className="text-orange-500 cursor-pointer" />
        <div className="absolute z-50 group-hover:flex right-0 top-10 hidden w-[230px] flex-col transition-all py-3 px-3 bg-white rounded-md shadow-xl">
            <Link href={`/account/profile-setting/${loggedInUser.result?._id}`} className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <RiProfileLine size={24} />
              <span >Profile Setting</span>
            </Link>
            <Link href={`/account/account-setting/${loggedInUser.result?._id}`} className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <MdSettingsBrightness size={24} />
              <span >Account Setting</span>
            </Link>
            <Link href={`/account/change-password/${loggedInUser.result?._id}`} className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <PiFolderLockFill size={24} />
              <span >Change Password</span>
            </Link>
            <button type='button' 
              className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500"
              onClick={handleLogOut}>
              <MdLogout size={24} />
              Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfMenu;
