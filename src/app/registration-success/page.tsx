"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams  } from 'next/navigation';
import NavMenu from '../components/navbar/navBar';
import Loading from '../account/Loading';

const RegistrationSuccess : React.FC = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const sdkId = searchParams.get("sdkId");

  return (
    <div>
      <NavMenu/>
      <div className='flex items-center justify-center my-24'>
        <div className='formStyle w-auto items-center'>
            <p className='uppercase text-xl text-orange-600 font-bold'>Congratulation !</p> 
            <p>You have been registered successfully.</p>  
            <p className='font-bold'>Your Sadhak ID</p> 
            <p>{sdkId || "N/A"}</p>
            <button type='button' className='btnLeft' onClick={()=>router.push('/login')}>Login Here</button>
        </div>
      </div>
    </div>
  )
};

const RegistrationSuccessWrapper = () => {
  return (
    <Suspense fallback={
      <div>
        <Loading/>
      </div>
    }>
      <RegistrationSuccess />
    </Suspense>
  );
};

export default RegistrationSuccessWrapper;
