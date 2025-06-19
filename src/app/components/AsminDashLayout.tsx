'use client';
import React from 'react';
import TotalUsers from './dashboard/TotalUsers';

const AdminDashLayout : React.FC = () => {

  return (
    <div>
      <div className='grid grdi-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 w-full'>
        <div className='bg-blue-600 shadow-xl rounded-md h-auto'>
            <TotalUsers/>
        </div>
        <div className='bg-pink-600 shadow-xl rounded-md h-[120px]'>
            
        </div>
        <div className='bg-amber-600 shadow-xl rounded-md h-[120px]'>
            
        </div>
        <div className='bg-red-600 shadow-xl rounded-md h-[120px]'>
            
        </div>
      </div>
    </div>
  )
}

export default AdminDashLayout;
