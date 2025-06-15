'use client';
import React, { useEffect, useState } from 'react';
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

  const [loggedInUser, setLoggedInUser] = useState({
      id: "",
      usrName: "",
      usrRole: "",
      isAdmin: "",
    });
  
    useEffect(() => {
    try {
      const cookie = Cookies.get("loggedInUser");
      if (cookie) {
          const parsed = JSON.parse(cookie);
          setLoggedInUser({
          id: parsed.id || "",
          usrName: parsed.usrName || "",
          usrRole: parsed.usrRole || "",
          isAdmin: parsed.isAdmin || "", 
        });
      }
      } catch (error) {
        console.error("Error parsing loggedInUser cookie:", error);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(()=>{
    async function fetchMyCourseData() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/my-courses?sdkid=${loggedInUser.id}`);
        const data = await response.json();
        const updatedCoList = data?.coList?.map((item:any) => { 
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
  },[loggedInUser.id])

  if(isLoading){
    return <div>
        <Loading />
    </div>
   };

  return (
    <div className='flex flex-col gap-9 md:p-9'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 w-full p-2 md:p-4'>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>

        </div>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>
            
        </div>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>
            
        </div>
        <div className='bg-gray-100 shadow-xl rounded-md h-[120px]'>
            
        </div>
      </div>
      <div className='flex gap-9 w-full justify-start'>
        <MyElgCourses myCoData={myCoData} />
      </div>
    </div>
  )
}

export default SadhakDashLayout;
