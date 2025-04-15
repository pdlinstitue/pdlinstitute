"use client"
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import Link from 'next/link';
import { MdDashboard } from "react-icons/md";
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
import SadhakMenu from './submenus/SadhakMenu';
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import PermitMenu from './submenus/PermitMenu';



const AdminSideMenu: React.FC = () => {

  const pathName = usePathname();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  const handleToggle = (number: number) => { 
    setSelectedNumber(number === selectedNumber ? null : number); 
  };
  
  return (
    <div>
      <div className='flex flex-col gap-2'>
          <Link href='/account/admin-dashboard' className={`group flex gap-2 p-2 rounded-sm mt-3 ${pathName === '/account/dashboard' ? 'bg-white text-black' : 'text-white bg-orange-500 hover:bg-white hover:text-black'}`}>
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
          <Link href="/account/attendance-list" className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <FaCalendarCheck size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>ATTENDANCE</p>
          </Link>
          <button type='button' onClick={() =>handleToggle(11)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <SiAdblock size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>PERMISSION</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 11 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
          {
            selectedNumber === 11 && (
              <div className='flex w-full px-[35px]'>
                <PermitMenu/>
              </div>
            )
          } 
          <button type='button' onClick={() =>handleToggle(7)} className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
            <BiSolidDockTop size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>DOCUMENTS</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 7 ? 'rotate-180 duration-500' : ''}`} />      
          </button>
        {
          selectedNumber === 7 && (
            <div className='flex w-full px-[35px]'>
              <DocMenu/>
            </div>
          )
        }
        <Link href='/account/enquiry-list' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
          <BsFillQuestionOctagonFill size={24} className=' group-hover:text-black'/>
          <p className='font-semibold group-hover:text-black'>ENQUIRIES</p>
        </Link>
        <Link href='/account/reports' className='group flex gap-2 text-white bg-orange-500 hover:bg-white p-2 rounded-sm'>
          <HiOutlineDocumentReport size={24} className=' group-hover:text-black'/>
          <p className='font-semibold group-hover:text-black'>REPORTS</p>
        </Link>
        </div>
    </div>
  )
}

export default AdminSideMenu;