"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


interface MyCoursesProps {
  myCoData: any
}

const MyElgCourses : React.FC<MyCoursesProps> = ({myCoData}) => {
    
  const router = useRouter();

  return (
    <div>
      {myCoData?.map((cor:any) => (
          <div className='w-[360px]'  key={cor._id} >
            <div className='flex flex-col bg-white rounded-md shadow-xl p-9 gap-3 border-[1.5px] border-orange-600'>
              <div className="w-full border-[1.5px] bg-gray-100">
                <img
                  src={cor.coImg || "/images/uploadImage.jpg"}
                  alt="Course"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className='text-lg font-bold bg-gray-100 p-2 text-center'>{cor.coName}</h2>
              <p className='text-sm text-justify'>{cor.coShort}</p>
              <div className='flex justify-between text-sm'>
                  <p><span className='font-bold'>Category:</span> {cor.coCat}</p>
                  <p><span className='font-bold'>Type:</span> {cor.coType}</p>
              </div>
              <div className='flex justify-between text-sm'>
                  <p className='text-sm'><span className='font-bold'>Duration:</span> {cor.durDays} DAYS</p>
                  <p className='text-sm'><span className='font-bold'>Hrs:</span> {cor.durHrs}</p>
              </div>
              <p className='text-sm'><span className='font-bold'>Elegibility:</span>{cor.eligibilityName}</p>
              <div className='grid grid-cols-2 gap-1'>
                  <button type='button'  className='btnLeft' onClick={()=>router.push(`/account/my-courses/${cor._id}/read-more`)}>Read More</button>
                  <button type='button'  className='btnRight' onClick={()=>router.push(`/account/my-courses/${cor._id}/enroll-course`)}>Enroll</button>
              </div>
            </div>
          </div>
          ))}
      </div>
  )
}

export default MyElgCourses;
