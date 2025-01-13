"use client"
import Image from 'next/image';
import React, { useState } from 'react'
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




const SideBar: React.FC = () => {

  const [selectedNumber, setSelectedNumber] = useState<number | null>(null); 
  
  
  const handleToggle = (number: number) => { 
    setSelectedNumber(number === selectedNumber ? null : number); 
  };
  
  return (
    <div>
      <div className='flex flex-col w-[230px] bg-orange-500 h-screen p-4'>
        <div className='flex gap-2 items-center bg-orange-400 rounded-sm'>
          <Image alt='pdlinstitute' src="/images/pdlLogo.jpg" width={52} height={52}/>
          <p className='text-white font-bold'>PDL INSTITUTE</p>
        </div>
        <div className='flex flex-col'>
          <Link href='/account/dashboard' className='group flex gap-2 text-white hover:bg-white p-2 rounded-md mt-3'>
            <MdDashboard size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>DASHBOARD</p>
          </Link>
          <button type='button' onClick={() =>handleToggle(1)} className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
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
          <Link href='/account/sadhaklist' className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
            <BiSolidUserRectangle size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>SADHAK LIST</p>
          </Link>
          <button type='button' onClick={() =>handleToggle(3)} className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
            <MdCastForEducation size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>TRAINING</p>
            <IoIosArrowDown size={24} className={`ml-auto group-hover:text-black ${selectedNumber === 3 ? 'rotate-180 duration-500' : ''}`} />        
          </button>
          {
            selectedNumber === 3 && (
              <div className='flex w-full px-[35px]'>
                <TrainingMenu/>
              </div>
            )
          }
          <button type='button' onClick={() =>handleToggle(2)} className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
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
          <Link href='/account/studymaterials' className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
            <FaBookReader size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>STUDY MAT</p>
          </Link>
          <button type='button' onClick={() =>handleToggle(4)} className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
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
          <button type='button' onClick={() =>handleToggle(5)} className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
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
          <button type='button' onClick={() =>handleToggle(6)} className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
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
          <Link href='/account/dashboard' className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
            <HiOutlineDocumentReport size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>ACCOUNTS</p>
          </Link>
          <Link href='/account/dashboard' className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
            <SiAdblock size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>PERMISSION</p>
          </Link>
          <Link href='/account/dashboard' className='group flex gap-2 text-white hover:bg-white p-2 rounded-md'>
            <HiOutlineDocumentReport size={24} className=' group-hover:text-black'/>
            <p className='font-semibold group-hover:text-black'>REPORTS</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SideBar 