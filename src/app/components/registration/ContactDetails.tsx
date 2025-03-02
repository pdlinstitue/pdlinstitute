"use client";
import { StepperContext } from '@/app/context/StepperContext';
import React, { useContext } from 'react';

const ContactDetails : React.FC = () => {
    
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
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Whatsapp Number:*</label>
            <input type='text' name='sdkWhtNbr' value={userData.sdkWhtNbr} placeholder='with country code e.g. +91 if india' onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Phone Number:*</label>
            <input type='text' name='sdkPhone' value={userData.sdkPhone} placeholder='with country code e.g. +91 if india' onChange={handleChange} className='inputBox' />
          </div>
        </div>
        <div className='grid grid-cols-1 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Email:*</label>
            <input type='email' name='sdkEmail' value={userData.sdkEmail} onChange={handleChange} className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetails;
