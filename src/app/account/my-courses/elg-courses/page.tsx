"use client";
import React, { useEffect } from 'react';
import Loading from '../../Loading';
import { BASE_API_URL } from '@/app/utils/constant';
import Cookies from 'js-cookie';
import MyElgCourses from '@/app/components/ElgCourses';

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

const MyCourses : React.FC = () => {

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
       <div className='flex gap-9 w-full'>
          <MyElgCourses myCoData={myCoData}/>
        </div>
    </div>
  )
}

export default MyCourses;
