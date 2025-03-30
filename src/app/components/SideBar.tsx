"use client"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MdDashboard } from "react-icons/md";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import { BiSolidUserRectangle } from "react-icons/bi";
import { SiGoogleclassroom } from "react-icons/si";
import { BiSolidDockTop } from "react-icons/bi";
import { FaCalendarCheck } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdCastForEducation } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import EnrollMenu from './submenus/EnrollMenu';
import ClassMenu from './submenus/ClassMenu';
import TrainingMenu from './submenus/TrainingMenu';
import { SiAdblock } from "react-icons/si";
import DocMenu from './submenus/DocMenu';
import { PiChalkboardTeacher } from "react-icons/pi";
import SadhakMenu from './submenus/SadhakMenu';
import { RiCoupon3Line } from "react-icons/ri";
import Cookies from 'js-cookie';
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import MyCourseMenu from './submenus/MyCourseMenu';
import { GiMeditation } from "react-icons/gi";
import MyDocMenu from './submenus/MyDocMenu';
import Loading from '../account/Loading';
import SadhakSideMenu from './SadhakSideMenu';
import AdminSideMenu from './AdminSideMenu';



const SideBar: React.FC = () => {

  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
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
  
  const handleToggle = (number: number) => { 
    setSelectedNumber(number === selectedNumber ? null : number); 
  };

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
        {
          loggedInUser.result.usrRole === 'Sadhak' && (
            <SadhakSideMenu/>
          )
        }
        {
          loggedInUser.result.usrRole === 'Admin' && (
            <AdminSideMenu/>
          )
        }
      </div>
    </div>
  </div>
  )
}

export default SideBar;