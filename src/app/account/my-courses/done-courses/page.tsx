"use client";
import AnyCourseYet from '@/app/components/AnyCourseYet';
import CompletedCourse from '@/app/components/CompletedCourse';
import { BASE_API_URL } from '@/app/utils/constant';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

interface DoneCoursesProps {
  coName: string;
  coShort: string;
  coCat: string;
  coElg: string;
  coImg?: string;
  coType: string;
  coWhatGrp: string;
  coTeleGrp: string;
  coDon: number;
  durDays: number;
  durHrs: number;
  usrId: string;
  eligibilityName: string;
}

const DoneCourses : React.FC = () => {
  
  const [myCoData, setMyCoData] = useState<DoneCoursesProps[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  useEffect(() => {
      async function fetchMyCourseData() {
        try {
          const response = await fetch(
            `${BASE_API_URL}/api/done-courses?sdkid=${loggedInUser.id}`
          );
          const data = await response.json();
          const updatedCoList = data.coList.map((item: any) => {
            return { ...item, coCat: item.coCat.catName };
          });
          setMyCoData(updatedCoList);
        } catch (error) {
          console.error("Error fetching done course data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMyCourseData();
    }, [loggedInUser.id]);

  return (
    <div>
      <div>
        {myCoData && myCoData.length > 0 ? (
          <CompletedCourse myCoData={myCoData}/>
        ) : (
          <AnyCourseYet/>      
        )}
      </div>
    </div>
  )
}

export default DoneCourses; 
