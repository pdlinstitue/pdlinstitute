"use client";
import React from 'react';

const ChangePassword = () => {

  return (
    <div className='flex justify-center items-center my-24'> 
        <form className='flex w-[400px] flex-col border border-orange-500 p-9 gap-2 rounded-md shadow-xl'>
            <div className='flex flex-col gap-2'>
                <label>Old Password:</label>
                <input type='password' className='inputBox' />
            </div>
            <div className='flex flex-col gap-2'>
                <label>New Password:</label>
                <input type='password' className='inputBox' />
            </div>
            <div className='flex flex-col gap-2'>
                <label>Confirm Password:</label>
                <input type='password' className='inputBox' />
            </div>
            <div>
                <button type='button' className='btnLeft'>Save</button>
            </div>
        </form>
    </div>
  )
}

export default ChangePassword;
