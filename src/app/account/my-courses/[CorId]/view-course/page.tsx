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
    usrId: string,
    eligibilityName:string
}

const ViewCourse : React.FC<ICourseParams> = ({params}) => {

  const { CorId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<ViewCourseProps>({coName:'', coShort:'', coType:'', coAuth:'', coDon:0, coDesc:'', prodType:'Courses', coCat:'', coElg:'', coWhatGrp:'', coTeleGrp:'', durDays:0, durHrs:0, coImg:'', usrId:'', eligibilityName:''});

  useEffect(() =>{
  async function fetchCourseData() {
    try 
        {
            const coData = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course` , {cache: "no-store"});
            const courseById = await coData.json();
            const fullCourseData = { 
                ...courseById.corById, 
                coCat: courseById.catName,
                eligibilityName: courseById.corEligibility 
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
    <div className='flex items-center justify-center py-16'>
      <div className='formStyle max-w-[400px]'>
        {data.coImg ? (
            <Image
                src={`/api/image-upload?name=${data.coImg}`}
                alt="courseImage"
                width={320}
                height={220}
            />):null
        }
        <h2 className='font-semibold text-lg text-center text-white p-2 bg-orange-500'>{data.coName}</h2>
        <div className="flex justify-between text-sm gap-2">
            <p>
                <span className="font-bold">Category:</span> {data.coCat}
            </p>
            <p>
                <span className="font-bold">Type:</span> {data.coType}
            </p>
        </div>
        <div className='flex justify-between text-sm gap-2'>
            <div className='text-sm'>
                <p><span className='font-semibold uppercase mr-3'>Days:</span>{data.durDays}</p>
            </div>
            <div className='text-end text-sm'>
                <p><span className='font-semibold uppercase mr-3'>Hrs:</span>{data.durHrs}</p>
            </div>
        </div>
        <div className='flex justify-between text-sm gap-2'>
            <p className="text-sm"><span className="font-bold">Eligibility:</span> {data?.eligibilityName}</p>
            <p className="text-sm"><span className="font-bold">Fee: &#8377;</span> {data?.coDon?.toLocaleString()}</p>
        </div>
        <div className='grid grid-cols-2 gap-1'>
            <button type='button' className='btnLeft' onClick={() => router.push(`/account/my-courses/${CorId}/read-more`)}>
                Read More
            </button>
            <button type='button' className='btnRight' onClick={()=> router.push('/account/my-courses/all-courses')}>
                Back
            </button>
        </div>
      </div>
    </div>
  )
}

export default ViewCourse;
