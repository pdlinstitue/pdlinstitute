"use client";
import React from 'react';

const UnauthorizedAccess = () => {

  return (
    <div className='flex items-center justify-center py-40'>
      <div className='formStyle w-[400px]'>
        <h1 className='text-2xl text-red-600'>Unauthorized Access</h1>
        <p>Opps! You are unauthorized to use this resourse.</p>
      </div>
    </div>
  )
}

export default UnauthorizedAccess;
