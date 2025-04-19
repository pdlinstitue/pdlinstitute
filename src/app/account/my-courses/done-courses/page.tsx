"use client";
import React, { useEffect, useState } from 'react';
import Loading from '../../Loading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import Cookies from 'js-cookie';
import { TfiFaceSad } from "react-icons/tfi";

interface DoneCoursesProps {
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

const DoneCourses : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myCoData, setMyCoData] = useState<DoneCoursesProps[] | null>([]);
  const [loggedInUser, setLoggedInUser] = useState({
      result: {
        _id: '',
        usrName: '',
        usrRole: '',
      },
    });
   
  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || '';
      const userName = Cookies.get("loggedInUserName") || '';
      const userRole = Cookies.get("loggedInUserRole") || '';
      setLoggedInUser({
        result: {
          _id: userId,
          usrName: userName,
          usrRole: userRole,
        },
      });
    } catch (error) {
        console.error("Error fetching loggedInUserData.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(()=>{
    async function fetchMyCourseData() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/done-courses?sdkid=${Cookies.get("loggedInUserId")}`,);
        const data = await response.json();
        const updatedCoList = data.coList.map((item:any) => { 
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
  },[])

  if(isLoading){
    return <div>
        <Loading />
    </div>
   };

   return (
    <div>
      {myCoData && myCoData.length > 0 ? (
        <div className="grid grid-cols-3 gap-9 my-9">
          {myCoData?.map((cor: any) => (
            <div
              key={cor._id}
              className="flex flex-col bg-white rounded-md shadow-xl p-9 gap-3 border-[1.5px] border-orange-600"
            >
              <Image
                src="/images/sadhak.jpg"
                alt="courseImage"
                width={320}
                height={220}
              />
              <h2 className="text-lg font-bold bg-gray-100 p-2 text-center">
                {cor.coName}
              </h2>
              <p className="text-sm text-justify">{cor.coShort}</p>
              <div className="flex justify-between text-sm">
                <p>
                  <span className="font-bold">Category:</span> {cor.coCat}
                </p>
                <p>
                  <span className="font-bold">Type:</span> {cor.coType}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-sm">
                  <span className="font-bold">Duration:</span> {cor.durDays} DAYS
                </p>
                <p className="text-sm">
                  <span className="font-bold">Hrs:</span> {cor.durHrs}
                </p>
              </div>
              <p className="text-sm">
                <span className="font-bold">Elegibility:</span>{" "}
                {cor.eligibilityName}
              </p>
              <div className="grid grid-cols-1 gap-1">
              <button
                type="button"
                className="btnRight"
                disabled={cor.reqStatus === "Pending"}
                onClick={() => {
                  if (cor.reqStatus === "Approved") {
                    router.push(`/account/my-courses/${cor._id}/enroll-course`);
                  } else if (!cor.reqStatus || cor.reqStatus === "Rejected") {
                    router.push(`/account/my-courses/${cor._id}/request-to-re-enroll`);
                  }
                }}
              >
                {cor.reqStatus === "Pending"
                  ? "Requested"
                  : cor.reqStatus === "Approved"
                  ? "Re-enroll"
                  : "Request to Re-enroll"}
                </button>
                <button
                  type="button"
                  className="btnLeft"
                  onClick={() =>
                    router.push(`/account/my-courses/${cor._id}/read-more`)
                  }
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 justify-center items-center my-48">
          <TfiFaceSad className='text-orange-600' size={34}/>
           <p className='text-lg font-semibold'>You haven't completed any course yet.</p>
        </div>
        
      )}
    </div>
  );
}

export default DoneCourses;
