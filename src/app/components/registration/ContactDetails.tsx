"use client";
import { StepperContext } from '@/app/context/StepperContext';
import React, { useContext, useState } from 'react';

const ContactDetails: React.FC = () => {

  const stepperContext = useContext(StepperContext);

  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }

  const { userData, setUserData } = stepperContext;
  const [isSameAsWhatsapp, setIsSameAsWhatsapp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setUserData({...userData, [name]: value});
  }

  const handleSameAsWhatsappToggle = () => {
    const newValue = !isSameAsWhatsapp;
    setIsSameAsWhatsapp(newValue);
    if (newValue) {
      setUserData(prev => ({
        ...prev,
        sdkPhone: prev.sdkWhtNbr
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        sdkPhone: ''
      }));
    }
  };

  return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Whatsapp Number:*</label>
            <input
              type='text'
              name='sdkWhtNbr'
              value={userData.sdkWhtNbr}
              placeholder='with country code e.g. +91 if india'
              onChange={handleChange}
              className='inputBox'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-3'>Phone Number:*
              <input
                type='checkbox'
                checked={isSameAsWhatsapp}
                onChange={handleSameAsWhatsappToggle}
              />
              <span>Check if same</span>
            </label>
            <input
              type='text'
              name='sdkPhone'
              value={userData.sdkPhone}
              placeholder='with country code e.g. +91 if india'
              onChange={handleChange}
              className='inputBox'
              disabled={isSameAsWhatsapp}
            />
          </div>
        </div>
        <div className='grid grid-cols-1 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Email:*</label>
            <input
              type='email'
              name='sdkEmail'
              placeholder='pdlinstitute@gmail.com'
              value={userData.sdkEmail}
              onChange={handleChange}
              className='inputBox'
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex flex-col gap-2'>
            <label>Phone OTP:</label>
            <input
              type='text'
              name='sdkPhoneOtp'
              value={userData.sdkPhoneOtp || ''}
              onChange={handleChange}
              className='inputBox'
              placeholder='Enter phone OTP'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Email OTP:</label>
            <input
              type='text'
              name='sdkEmailOtp'
              value={userData.sdkEmailOtp || ''}
              onChange={handleChange}
              className='inputBox'
              placeholder='Enter email OTP'
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <button type='button' className='btnLeft'>Send OTP</button>
          <button type='button' className='btnRight'>Verify</button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
