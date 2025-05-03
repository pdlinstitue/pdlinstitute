"use client";
import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface IReadParams {
  params:Promise<{
    CorId: string;
  }>
}
interface ReadMoreProps {
  coDesc: string;
  coName: string;
}

const ReadMore : React.FC<IReadParams> = ({params}) => {

  const router = useRouter();
  const {CorId} = use(params);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coData, setCoData] = useState<ReadMoreProps>({coDesc:'', coName:''});

  useEffect(() => {
    async function fetchCourseById() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course`);
        const courseData = await res.json();
        setCoData(courseData?.corById);
      } catch (error) {
        console.error("Error fetching corData by id: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  fetchCourseById();
  }, []);

  if (isLoading) {
    return <div>
      <Loading/>
    </div>;
  }

  return (
    <div className='flex justify-center items-center py-24 w-auto'>
      <div className='formStyle w-[600px]'>
        <h1 className='text-2xl text-center font-bold p-3 rounded-sm bg-gray-200'>{coData?.coName}</h1>
        <div className='inputBox'>{coData?.coDesc}</div>
        <button type='button' className='btnLeft' onClick={() => router.back()}>Back</button>
      </div>
    </div>
  )
}

export default ReadMore;
