
'use client';
import React, { use, useEffect, useState } from 'react';
import { BsWhatsapp } from 'react-icons/bs';
// import { FaTelegram } from 'react-icons/fa';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';


interface ICourseParams {
  params:Promise<{
    CorId: string;
  }>
}

interface courseByIdProps {
  coWhatGrp: string;
  coTeleGrp: string;
}

const JoinGroups : React.FC<ICourseParams> = ({params}) => {

  const { CorId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [courseById, setCourseById] = useState<courseByIdProps>({coWhatGrp: '', coTeleGrp: ''});

  useEffect(() => {
    async function fetchCourseById() {
      try {
        const res = await fetch( `${BASE_API_URL}/api/courses/${CorId}/view-course`);
        const courseData = await res.json();
        setCourseById(courseData?.corById);
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
    <div className='flex justify-center items-center my-24'>
      <div className='formStyle w-auto justify-center'>
        <div className='text-center w-[400px] mb-6'>
            <p>Join groups for receiving information regarding upcoming batches.</p>
        </div>
        <div className='flex items-center gap-4 justify-center'>
          <a 
            href={courseById.coWhatGrp} 
            target="_blank" 
            rel="noopener noreferrer" 
            className='flex gap-2 italic'
          >
            <BsWhatsapp size={24} className='text-green-600'/> HINDI            
          </a>
          <a 
            href={courseById.coTeleGrp} 
            target="_blank" 
            rel="noopener noreferrer" 
            className='flex gap-2 italic'
          >
            <BsWhatsapp size={24} className='text-green-600'/> ENG
          </a>
        </div>
      </div>
    </div>
  )
}

export default JoinGroups
