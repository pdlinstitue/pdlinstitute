"use client";
import { StepperContext } from '@/app/context/StepperContext';
import React, { useContext, useEffect, useState } from 'react';


interface countryListProps {
  country_phonecode: string;
}
const ContactDetails: React.FC = () => {

  const stepperContext = useContext(StepperContext);

  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }

  const { userData, setUserData } = stepperContext;
  const [countryList, setCountryList] = useState<countryListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  useEffect(()=>{
    async function fetchCountryList() {
      try {
        const response = await fetch('/api/countries');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCountryList(data?.ctrList);
      } catch (error) {
        console.error('Error fetching country list:', error);
      } finally {
        setIsLoading(false);
      }
    }
  fetchCountryList();
  },[]);

  return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
          <div className='flex flex-col gap-2'>
            <label>Whatsapp Number:*</label>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-1'>
              <select className='w-full sm:w-24 inputBox'>
                {countryList?.map((item, index) => (
                  <option key={index} value={item.country_phonecode}>
                    {item.country_phonecode}
                  </option>
                ))}
              </select>
              <input
                type='text'
                name='sdkWhtNbr'
                value={userData.sdkWhtNbr}
                placeholder='Enter whatsapp number'
                onChange={handleChange}
                className='inputBox w-full'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='flex flex-col sm:flex-row sm:items-center gap-2'>
              Phone Number:*
              <div className="flex items-center gap-2">
                <input
                  type='checkbox'
                  checked={isSameAsWhatsapp}
                  onChange={handleSameAsWhatsappToggle}
                />
                <span>Check if same</span>
              </div>
            </label>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-1'>
              <select className='w-full sm:w-24 inputBox'>
                {countryList?.map((item, index) => (
                  <option key={index} value={item.country_phonecode}>
                    {item.country_phonecode}
                  </option>
                ))}
              </select>
              <input
                type='text'
                name='sdkPhone'
                value={userData.sdkPhone}
                placeholder='Enter phone number'
                onChange={handleChange}
                className='inputBox w-full'
                disabled={isSameAsWhatsapp}
              />
            </div>
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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 mt-4'>
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
  
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1 mt-4'>
          <button type='button' className='btnLeft w-full'>Send OTP</button>
          <button type='button' className='btnRight w-full'>Verify</button>
        </div>
      </div>
    </div>
  );
  
};

export default ContactDetails;
