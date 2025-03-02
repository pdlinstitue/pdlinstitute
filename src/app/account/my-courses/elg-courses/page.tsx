"use client";
import React, { useEffect } from 'react';
import Loading from '../../Loading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import Cookies from 'js-cookie';

interface IMyCourseParams {
params:Promise<{
  SdkId:string;
}>
}

interface MyCoursesProps {
  coName: string, 
  coShort:string, 
  coCat: string,
  coElg: string,
  coImg?: string,
  coType: string,
  coWhatGrp: string,
  coTeleGrp: string,
  coDon:number, 
  durDays:number, 
  durHrs:number, 
  usrId: string
}

const MyCourses : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [myCoData, setMyCoData] = React.useState<MyCoursesProps[] | null>([]);

  const loggedInUser = {
    result:{
      _id:Cookies.get("loggedInUserId"), 
      usrName:Cookies.get("loggedInUserName"),
      usrRole:Cookies.get("loggedInUserRole"),
    }
  }; 

  useEffect(()=>{
    async function fetchMyCourseData() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/my-courses?sdkid=${loggedInUser.result._id}`);
        const data = await response.json();
        const updatedCoList = data.coList.map((item:any) => { 
            return { ...item, coCat: item.coCat.catName };
        });
        setMyCoData(updatedCoList);
      } catch (error) {
        console.error("Error fetching course data:", error);      
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyCourseData();
  },[])

  if(isLoading){
    return <div>
        <Loading />
    </div>
   };

  return (
    <div>
       <div className='grid grid-cols-3 gap-9 my-9'>
        {myCoData?.map((cor:any) => (
            <div key={cor._id} className='flex flex-col bg-white rounded-md shadow-xl p-9 gap-3 border-[1.5px] border-orange-600'>
                <Image src="/images/sadhak.jpg" alt="courseImage" width={320} height={220}/>
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
                <p className='text-sm'><span className='font-bold'>Elegibility:</span>{cor.coElg}</p>
                <div className='grid grid-cols-2 gap-1'>
                    <button type='button'  className='btnLeft' onClick={()=>router.push(`/account/my-courses/${cor._id}/read-more`)}>Read More</button>
                    <button type='button'  className='btnRight' onClick={()=>router.push(`/account/my-courses/${cor._id}/enroll-course`)}>Enroll</button>
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default MyCourses;
