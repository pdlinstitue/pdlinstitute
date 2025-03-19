"use client";
import React, { useState, useEffect, use } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<ViewCourseProps>({coName:'', coShort:'', coType:'', coAuth:'', coDon:0, coDesc:'', prodType:'Courses', coCat:'', coElg:'', coWhatGrp:'', coTeleGrp:'', durDays:0, durHrs:0, coImg:'', usrId:''});

  useEffect(() =>{
  async function fetchCourseData() {
    try 
        {
            const coData = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course` , {cache: "no-store"});
            const courseById = await coData.json();
            const fullCourseData = { 
                ...courseById.corById, 
                coCat: courseById.catName 
            }; 
            setData(fullCourseData);
        } catch (error) {
            console.error("Error fetching category data: ", error);
        } finally {
            setIsLoading(false);
        } 
    }
    fetchCourseData();
    },[]);

    if(isLoading){
        return <div>
            <Loading />;
        </div>
    };

  return (
    <div className='flex items-center justify-center'>
      <div className='formStyle my-3 w-[400px]'>
        <Image alt="course" src={data.coImg || "/images/uploadImage.jpg"} width={400} height={200}/>
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
        <div className='grid grid-cols-2 gap-1'>
            <button type='button' className='btnLeft' onClick={()=> router.push(`/account/course-list/${CorId}/enroll-sadhak`)}>
                Enroll
            </button>
            <button type='button' className='btnRight' onClick={()=> router.push('/account/course-list')}>
                Back
            </button>
        </div>
      </div>
    </div>
  )
}

export default ViewCourse;
