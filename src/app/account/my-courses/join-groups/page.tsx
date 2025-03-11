
'use client';
import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { FaTelegram } from 'react-icons/fa';

const JoinGroups = () => {

  return (
    <div className='flex justify-center items-center my-24'>
      <div className='formStyle w-auto justify-center'>
        <div className='text-center w-[400px] mb-6'>
            <p>Join groups for receiving information regarding upcoming batches.</p>
        </div>
        <div className='flex items-center gap-4 justify-center'>
          <button type='button' className='flex gap-2 italic'>
            <BsWhatsapp size={24} className='text-green-600'/>               
          </button>
        <button type='button' className='flex gap-2 italic'>
            <FaTelegram size={24} className='text-blue-500'/> 
          </button>  
        </div>
      </div>
    </div>
  )
}

export default JoinGroups
