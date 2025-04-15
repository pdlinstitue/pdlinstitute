'use client';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import Loading from '../account/Loading';
import MyElgCourses from './ElgCourses';
import { BASE_API_URL } from '../utils/constant';


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
  usrId: string,
  eligibilityName:string
}

const SadhakDashLayout : React.FC = () => {

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
    <div className='flex flex-col gap-9 p-9'>
      <div className='grid grid-cols-4 gap-6 w-full'>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>

        </div>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>
            
        </div>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>
            
        </div>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>
            
        </div>
      </div>
      <div>
        <MyElgCourses myCoData={myCoData} />
      </div>
    </div>
  )
}

export default SadhakDashLayout;
