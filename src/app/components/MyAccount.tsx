"use client";
import React from 'react';

const MyAccount = () => {

  return (
    <div className='flex justify-center items-center my-24'> 
        <form className='flex w-[400px] flex-col border border-orange-500 p-9 gap-2 rounded-md shadow-xl'>
            <div className='flex flex-col gap-2'>
                <label>Phone:</label>
                <input type='number' className='inputBox' />
            </div>
            <div className='flex flex-col gap-2'>
                <label>WhatsApp:</label>
                <input type='number' className='inputBox' />
            </div>
            <div className='flex flex-col gap-2'>
                <label>Email:</label>
                <input type='email' className='inputBox' />
            </div>
            <div>
                <button type='button' className='btnLeft'>Save</button>
            </div>
        </form>
    </div>
  )
}

export default MyAccount;
