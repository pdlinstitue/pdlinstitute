"use client";
import { StepperContext } from '@/app/context/StepperContext';
import Link from 'next/link';
import React, { useContext } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const CreatePass : React.FC = () => {

  const stepperContext = useContext(StepperContext);
      
  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }
  
  const {userData, setUserData} = stepperContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  }

  return (
    <div className='max-w-[600px] md:w-[600px]'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
          <label>Create Password:*</label>
          <input type='password' name='sdkPwd' placeholder='Min 8 characters' value={userData.sdkPwd} onChange={handleChange} className='inputBox' />
        </div>
        <div className='flex flex-col gap-2'>
          <label>Confirm Password:*</label>
          <input type='password' name='sdkConfPwd' placeholder='Min 8 characters' value={userData.sdkConfPwd} onChange={handleChange} className='inputBox' />
        </div>
        <div className='flex flex-col gap-2 items-center justify-center p-4 bg-gray-100 rounded-lg mt-4'>
          <Link href="https://chat.whatsapp.com/KHb4NUXolhb52QfLp0YXcE" target='_blank'><FaWhatsapp size={24}/></Link>
          <p className='italic text-md'>Join support group for any kind of assistance.</p>
        </div>
      </div>
    </div>
  )
}

export default CreatePass;
