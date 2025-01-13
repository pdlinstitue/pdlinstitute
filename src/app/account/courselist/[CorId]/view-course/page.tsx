"use client";
import React, { useState, useEffect, use } from 'react';
import { IoMdArrowDropleft } from "react-icons/io";
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface ICourseParams {
    params: Promise<{
        CorId?: string;
    }>;
}

interface ViewCourseProps{
    coName: string, 
    coShort:string, 
    prodType:string, 
    coAuth: string,
    coCat: string,
    coElg: string,
    coImg: string,
    coType: string,
    coWhatGrp: string,
    coTeleGrp: string,
    coDesc:string, 
    coDon:number, 
    durDays:number, 
    durHrs:number, 
    usrId: string
}

const ViewCourse : React.FC<ICourseParams> = ({params}) => {

  const { CorId } = use(params);
  const router = useRouter();
  const [data, setData] = useState<ViewCourseProps>({coName:'', coShort:'', coType:'', coAuth:'', coDon:0, coDesc:'', prodType:'Courses', coCat:'', coElg:'', coWhatGrp:'', coTeleGrp:'', durDays:0, durHrs:0, coImg:'', usrId:''});

  useEffect(() =>{
    async function fetchCourseData() {
    try {
        const coData = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course` , {cache: "no-store"});
        const courseById = await coData.json();
        setData(courseById.corById);
    } catch (error) {
        console.error("Error fetching category data: ", error);
    }
    }
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col my-3  gap-2 px-9 pt-9 pb-4 w-[350px] border-[1.5px] border-orange-500 rounded-md shadow-xl'>
        <Image alt="course" src="/images/sadhak.jpg" width={300} height={200}/>
        <h2 className='font-semibold text-lg text-center text-white p-2 bg-orange-500'>{data.coName}</h2>
        <div className='grid grid-cols-2 gap-1 text-sm font-semibold'>
            <div>
                <p>{data.coCat}</p>
            </div>
            <div className='text-end'>
                <p>{data.coType}</p>
            </div>
        </div>
        <div className='text-sm'>
            <p>{data.coShort}</p>
        </div>
        <div className='text-sm'>
            <p><span className='font-semibold uppercase mr-3'>Fee:</span>{data.coDon}</p>
        </div>
        <div className='grid grid-cols-2 gap-1'>
            <div className='text-sm'>
                <p><span className='font-semibold uppercase mr-3'>Days:</span>{data.durDays}</p>
            </div>
            <div className='text-end text-sm'>
                <p><span className='font-semibold uppercase mr-3'>Hrs:</span>{data.durHrs}</p>
            </div>
        </div>
        <button type='button' className='p-2 bg-gray-200 hover:bg-gray-100 uppercase font-semibold'>
            View Batches
        </button>
        <div className='flex gap-1 w-auto'>
            <button type='button' className='btnLeft w-full'>
                Read More
            </button>
            <button type='button' className='btnRight w-full'>
                Enroll
            </button>
        </div>
        <IoMdArrowDropleft  size={24} className='text-orange-500 cursor-pointer' onClick={()=> router.push('/account/courselist')} />
      </div>
    </div>
  )
}

export default ViewCourse;
