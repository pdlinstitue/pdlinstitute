"use client"
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import Link from 'next/link';
import { MdDashboard } from "react-icons/md";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdCastForEducation } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { PiChalkboardTeacher } from "react-icons/pi";
import { RiCoupon3Line } from "react-icons/ri";
import MyCourseMenu from './submenus/MyCourseMenu';
import { GiMeditation } from "react-icons/gi";
import MyDocMenu from './submenus/MyDocMenu';
import Loading from '../account/Loading';



const SadhakSideMenu: React.FC = () => {

  const pathName = usePathname();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  const handleToggle = (number: number) => { 
    setSelectedNumber(number === selectedNumber ? null : number); 
  };

  return (
    <div>
      <div className='flex flex-col gap-2'>
         <Link href='/account/sadhak-dashboard' className={`group flex gap-2 p-2 rounded-sm mt-3 ${pathName === '/account/dashboard' ? 'bg-white text-black' : 'text-white bg-orange-500 hover:bg-white hover:text-black'}`}>
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
         <Link href='/account/my-batches' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <PiChalkboardTeacher size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY BATCHES</p>
         </Link>
         <Link href='/account/my-coupons' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <RiCoupon3Line size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY COUPONS</p>
         </Link>
         <Link href='/account/my-practice-class' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <GiMeditation size={24} className=' group-hover:text-black'/>
           <p className='font-semibold group-hover:text-black'>MY PRACTICE</p>
         </Link>
         <Link href='/account/my-attendance' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
           <MdPlaylistAddCheckCircle size={24} className=' group-hover:text-black'/>
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
       </div>
  </div>
  )
}

export default SadhakSideMenu;