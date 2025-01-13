"use client";
import React from 'react';
import DashLayout from '../../components/DashLayout';
import Image from 'next/image';


const DashBoard: React.FC = () => {
  
  return (    
    <div className='flex flex-col border-[1.5px] border-orange-500 rounded-md'>
      <div className='flex h-[250px] w-full'>
        <Image alt="pdlInstitute"  src="/images/dashImage.png" width={1540} height={250}/>
      </div>
      <div className="overflow-auto p-6 max-h-[320px]" >
        <DashLayout/>
      </div>
    </div>    
  );
};

export default DashBoard;
