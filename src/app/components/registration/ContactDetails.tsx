"use client";
import { StepperContext } from '@/app/context/StepperContext';
import { SMS_KEY } from '@/app/utils/constant';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';


interface countryListProps {
  country_phonecode: string;
}
const ContactDetails: React.FC = () => {

  const stepperContext = useContext(StepperContext);

  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }

  const { userData, setUserData, setErrorMessage } = stepperContext;
  const [countryList, setCountryList] = useState<countryListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSameAsWhatsapp, setIsSameAsWhatsapp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const {name, value} = e.target;
      setUserData({...userData, [name]: value});
  }

  const handleSameAsWhatsappToggle = () => {
    const newValue = !isSameAsWhatsapp;
    setIsSameAsWhatsapp(newValue);
    if (newValue) {
      setUserData(prev => ({
        ...prev,
        sdkPhone: prev.sdkWhtNbr,
        sdkPhoneCntCode: prev.sdkWhtNbrCntCode
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        sdkPhone: '',
        sdkPhoneCntCode:'+91'
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

  const handleValidPhone = () => {
    const encodedPhone = encodeURIComponent(`${userData.sdkPhoneCntCode}${userData.sdkPhone}`);
  
    fetch(`/api/users/phoneexists?sdkPhone=${encodedPhone}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUserData(prev => ({
          ...prev,
          isPhoneValid: data.isPhoneValid
        }));
  
        if (data.isPhoneValid) {
          setErrorMessage("");
        } else {
          setErrorMessage(data.msg);
        }
      })
      .catch(error => {
        setErrorMessage("Error checking phone validity: " + error);
      });
  };  

  useEffect(() => {
    if (userData.sdkPhoneCntCode && userData.sdkPhone) {
      handleValidPhone();
    }
  }, [userData.sdkPhoneCntCode, userData.sdkPhone]);

  const handleValidEmail = () => {
    fetch(`/api/users/emailexists?sdkEmail=${userData.sdkEmail}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUserData(prev => ({
          ...prev,
          isEmailValid:data.isEmailValid
        }));

        if(data.isEmailValid){
          setErrorMessage("");
        }
        else{
          setErrorMessage(data.msg);
        }
      })
      .catch(error => {
        setErrorMessage("Error checking email validity: "+ error);
      });
  };

  useEffect(() => {
    if (userData.sdkEmail) {
      handleValidEmail();
    }
  }, [userData.sdkEmail]);

  const handleSendOtp = () => {
    const encodedPhoneCode = encodeURIComponent(userData.sdkPhoneCntCode);
    const encodedPhone = encodeURIComponent(userData.sdkPhone);
  
    fetch(`https://2factor.in/API/V1/${SMS_KEY}/SMS/${encodedPhoneCode}${encodedPhone}/AUTOGEN2/OTP1`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUserData(prev => ({
          ...prev,
          sdkOtpVerified: false,
          sdkPhoneSentOtp: data.OTP
        }));
        setErrorMessage("Otp sent.");
      })
      .catch(error => {
        setErrorMessage("Error sending OTP: " + error);
      });
  };      

const handleVerifyOtp=()=>{
  if(!userData.sdkPhoneSentOtp){
    setErrorMessage("Please send OTP.");
    return;
  }

  if(!userData.sdkPhoneOtp){
    setErrorMessage("Please enter OTP.");
    return;
  }

  if(userData.sdkPhoneSentOtp===userData.sdkPhoneOtp){
    setUserData(prev => ({
      ...prev,
      sdkOtpVerified: true
    }));
    setErrorMessage("OTP verified.");
  }
  else{
    setErrorMessage("OTP is invalid.");
  }
}

const resetOtpData = () =>{
  setUserData(prev => ({
    ...prev,
    sdkOtpVerified: false,
    sdkPhoneOtp: "",
    sdkPhoneSentOtp: "",
    sdkEmailOtp: "",
    sdkEmailSentOtp: ""
  }));
}

  return (
    <div>
      <div className='flex flex-col max-w-[600px]'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
          <div className='flex flex-col gap-2'>
            <label>Whatsapp Number:*</label>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-1'>
              <select className='w-full sm:w-24 inputBox' name='sdkWhtNbrCntCode' value={userData.sdkWhtNbrCntCode} onChange={handleChange}>              
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
            <div className='flex items-center gap-2'>
              <label>Phone Number:*</label>
              <input
                type='checkbox'
                checked={isSameAsWhatsapp}
                onChange={handleSameAsWhatsappToggle}
              />
              <span>Check if same</span>
            </div>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-1'>
            <select
                className='w-full sm:w-24 inputBox'
                name='sdkPhoneCntCode'
                value={userData.sdkPhoneCntCode}
                onChange={(e) => {
                  handleChange(e);
                  resetOtpData();
                }}
              >
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
                onChange={(e) => {
                  handleChange(e);
                  resetOtpData();
                }}
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
        <div className='grid grid-cols-1 md:grid-cols-1 gap-1 mt-4'>
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
          {/* <div className='flex flex-col gap-2'>
            <label>Email OTP:</label>
            <input
              type='text'
              name='sdkEmailOtp'
              value={userData.sdkEmailOtp || ''}
              onChange={handleChange}
              className='inputBox'
              placeholder='Enter email OTP'
            />
          </div> */}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1 mt-4'>
          <button type='button' className='btnLeft w-full' onClick={handleSendOtp}>Send OTP</button>
          <button type='button' className='btnRight w-full' onClick={handleVerifyOtp}>Verify</button>
        </div>
        <div className='flex flex-col gap-2 items-center justify-center p-4 bg-gray-100 rounded-lg mt-4'>
          <p className='italic text-md'>Join support group for any kind of assistance.</p>
          <Link href="https://chat.whatsapp.com/KHb4NUXolhb52QfLp0YXcE" target='_blank'><FaWhatsapp /></Link>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
