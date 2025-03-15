"use client"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdDashboard } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import { BiSolidUserRectangle } from "react-icons/bi";
import { SiGoogleclassroom } from "react-icons/si";
import { FaBookReader } from "react-icons/fa";
import { RxReader } from "react-icons/rx";
import { FaCalendarCheck } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdCastForEducation } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import EnrollMenu from './submenus/EnrollMenu';
import ClassMenu from './submenus/ClassMenu';
import TrainingMenu from './submenus/TrainingMenu';
import AssignMenu from './submenus/AssignMenu';
import AttendMenu from './submenus/AttendMenu';
import EventMenu from './submenus/EventMenu';
import { SiAdblock } from "react-icons/si";
import DocMenu from './submenus/DocMenu';
import SadhakMenu from './submenus/SadhakMenu';
import { RiCoupon3Line } from "react-icons/ri";
import Cookies from 'js-cookie';
import MyCourseMenu from './submenus/MyCourseMenu';
import { GiMeditation } from "react-icons/gi";
import MyDocMenu from './submenus/MyDocMenu';
import Loading from '../account/Loading';



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
       <React.Fragment>
         <Link href='/account/dashboard' className={`group flex gap-2 p-2 rounded-sm mt-3 ${pathName === '/account/dashboard' ? 'bg-white text-black' : 'text-white bg-orange-500 hover:bg-white hover:text-black'}`}>
           <MdDashboard size={24} className={pathName === '/account/dashboard' ? 'text-black' : 'group-hover:text-black'}/>
           <p className={`font-semibold ${pathName !== '/account/dashboard' && 'group-hover:text-black'}`}>DASHBOARD</p>
         </Link>
         <button type='button' onClick={() =>handleToggle(8)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <MdCastForEducation size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY COURSES</p>
           <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 7 ? 'rotate-180 duration-500' : ''}`} />      
         </button>
         {
           selectedNumber === 8 && (
             <div className='flex w-full px-[35px]'>
               <MyCourseMenu/>
             </div>
           )
         }
         <Link href='/account/my-coupons' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <RiCoupon3Line size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY COUPONS</p>
         </Link>
         <Link href='/account/my-practice-class' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <GiMeditation size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY PRACTICE</p>
         </Link>
         <Link href='/account/my-attendance' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <GiMeditation size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY ATTENDANCE</p>
         </Link>
         <button type='button' onClick={() =>handleToggle(9)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <HiOutlineDocumentReport size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY DOCS</p>
           <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 9 ? 'rotate-180 duration-500' : ''}`} />      
         </button>
         {
           selectedNumber === 9 && (
             <div className='flex w-full px-[35px]'>
                <MyDocMenu/>
             </div>
           )
         }
       </React.Fragment>
       )
      }
      {
        loggedInUser.result.usrRole === 'Admin' && (
        <React.Fragment>
          <Link href='/account/dashboard' className={`group flex gap-2 p-2 rounded-sm mt-3 ${pathName === '/account/dashboard' ? 'bg-white text-black' : 'text-white bg-orange-500 hover:bg-white hover:text-black'}`}>
          <MdDashboard size={24} className={pathName === '/account/dashboard' ? 'text-black' : 'group-hover:text-black'}/>
          <p className={`font-semibold ${pathName !== '/account/dashboard' && 'group-hover:text-black'}`}>DASHBOARD</p>
        </Link>
          <button type='button' onClick={() =>handleToggle(3)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <MdCastForEducation size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>COURSE MGM</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 3 ? 'rotate-180 duration-500' : ''}`} />        
          </button>
          {
            selectedNumber === 3 && (
              <div className='flex w-full px-[35px]'>
                <TrainingMenu/>
              </div>
            )
          }
          <button type='button' onClick={() =>handleToggle(2)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <SiGoogleclassroom size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>CLASSROOM</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 2 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
          {
            selectedNumber === 2 && (
              <div className='flex w-full px-[35px]'>
                <ClassMenu/>
              </div>
            )
          }
          <button type='button' onClick={() =>handleToggle(1)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
          <MdOutlineAppRegistration size={24} className=' group-hover:text-black'/>
          <p className='font-semibold group-hover:text-black'>ENROLLMENTS</p>
          <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 1 ? 'rotate-180 duration-500' : ''}`} />          
        </button>
          {
            selectedNumber === 1 && (
              <div className='flex w-full px-[35px]'>
                <EnrollMenu/>
              </div>
            )
          }
          <button type='button' onClick={() =>handleToggle(0)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <BiSolidUserRectangle size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>SADHAK LIST</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 0 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
          {
            selectedNumber === 0 && (
              <div className='flex w-full px-[35px]'>
                <SadhakMenu/>
              </div>
            )
          }
          <Link href='/account/study-materials' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <FaBookReader size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>STUDY MAT</p>
          </Link>
          <button type='button' onClick={() =>handleToggle(4)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <RxReader size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>ASSIGNMENT</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 2 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
          {
            selectedNumber === 4 && (
              <div className='flex w-full px-[35px]'>
                <AssignMenu/>
              </div>
            )
          }
          <button type='button' onClick={() =>handleToggle(5)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <FaCalendarCheck size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>ATTENDANCE</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 5 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
          {
            selectedNumber === 5 && (
              <div className='flex w-full px-[35px]'>
                <AttendMenu/>
              </div>
            )
          }
          <button type='button' onClick={() =>handleToggle(6)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <BsCalendarEvent  size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>EVENT MGM</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 6 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
          {
            selectedNumber === 6 && (
              <div className='flex w-full px-[35px]'>
                <EventMenu/>
              </div>
            )
          }
          <Link href='/account/dashboard' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <SiAdblock size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>PERMISSION</p>
          </Link>
          <Link href='/account/dashboard' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <HiOutlineDocumentReport size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>REPORTS</p>
          </Link>
          <button type='button' onClick={() =>handleToggle(7)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
          <HiOutlineDocumentReport size={24} className=' group-hover:text-black'/>
          <p className='font-semibold group-hover:text-black'>MY DOCS</p>
          <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 7 ? 'rotate-180 duration-500' : ''}`} />      
        </button>
        {
          selectedNumber === 7 && (
            <div className='flex w-full px-[35px]'>
              <DocMenu/>
            </div>
          )
        }
        </React.Fragment>
        )
      }
      </div>
    </div>
  </div>
  )
}

export default SideBar;