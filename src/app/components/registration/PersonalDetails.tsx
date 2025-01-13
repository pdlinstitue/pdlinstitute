import React from 'react'
import { useContext } from 'react';
import { StepperContext } from '@/app/context/StepperContext';

const PersonalDetails = () => {

  
  const stepperContext = useContext(StepperContext);
  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }
  const {userData, setUserData} = stepperContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  }
    
    return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-3 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>First Name:*</label>
            <input type='text' name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Middle Name:*</label>
            <input type='text' name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Last Name:*</label>
            <input type='text' name='' className='inputBox' />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Birth Date:*</label>
            <input type='date' name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Gender:*</label>
            <select name='' className='inputBox h-[46px] '>
              <option value='Female'>Female</option>
              <option value='Male'>Male</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Marital Status:*</label>
            <select name='' className='inputBox h-[45px] '>
              <option value='Married'>Married</option>
              <option value='Unmarried'>Unmarried</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>Spouce Name:*</label>
            <input type='text' name='' className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalDetails;
