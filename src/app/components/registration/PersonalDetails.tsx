import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '@/app/context/StepperContext';

const PersonalDetails : React.FC = () => {

  const stepperContext = useContext(StepperContext);

  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }
  
  const {userData, setUserData} = stepperContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  }
    
    return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-3 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>First Name:<span className='text-red-500'>*</span></label>
            <input type='text' name='sdkFstName' value={userData.sdkFstName} placeholder='As per Gvt. ID' onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Middle Name:</label>
            <input type='text' name='sdkMdlName' value={userData.sdkMdlName} placeholder='As per Gvt. ID' onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Last Name:<span className='text-red-500'>*</span></label>
            <input type='text' name='sdkLstName' value={userData.sdkLstName} placeholder='As per Gvt. ID' onChange={handleChange} className='inputBox' />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Birth Date:<span className='text-red-500'>*</span></label>
            <input type='date' name='sdkBthDate' value={userData.sdkBthDate} onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Gender:<span className='text-red-500'>*</span></label>
            <select name='sdkGender' value={userData.sdkGender} onChange={handleChange} className='inputBox h-[46px]'>
              <option value="" className='text-center'> --- Select --- </option>
              <option value='Female'>Female</option>
              <option value='Male'>Male</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-2 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Marital Status:<span className='text-red-500'>*</span></label>
            <select name='sdkMarStts' value={userData.sdkMarStts} onChange={handleChange} className='inputBox h-[45px] '>
              <option className='text-center' value=''>--- Select ---</option>
              <option value='Married'>Married</option>
              <option value='Unmarried'>Unmarried</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalDetails;
