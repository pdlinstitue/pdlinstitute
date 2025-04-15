"use client";
import { StepperContext } from '@/app/context/StepperContext';
import React, { useContext } from 'react';

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
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-rows-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Create Password:*</label>
            <input type='password' name='sdkPwd' placeholder='Min 8 characters' value={userData.sdkPwd} onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Confirm Password:*</label>
            <input type='password' name='sdkConfPwd' placeholder='Min 8 characters' value={userData.sdkConfPwd} onChange={handleChange} className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePass;
