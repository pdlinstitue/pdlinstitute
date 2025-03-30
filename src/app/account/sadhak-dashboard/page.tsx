"use client";
import React from 'react';
import Image from 'next/image';
import SadhakDashLayout from '@/app/components/SadhakDashLayout';
import Loading from '../Loading';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';

interface SadhakDataProps {
  _id?:string,
  sdkRegNo:string
}

const SadhakDashBoard: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sdkData, setSdkData] = useState<SadhakDataProps>({sdkRegNo:""});
  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });

  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || "";
      const userName = Cookies.get("loggedInUserName") || "";
      const userRole = Cookies.get("loggedInUserRole") || "";
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

  useEffect(() => {
    async function fetchCatData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/${Cookies.get("loggedInUserId")}/view-sadhak`);
        const sadhakData = await res.json();
        setSdkData(sadhakData.sdkById);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setIsLoading(false);
      }
    }
  fetchCatData();
  }, []);

  if(isLoading){
    return<div>
      <Loading/>
    </div>
  };
  
  return (    
    <div className='flex flex-col border-[1.5px] border-orange-500 rounded-md'>
      <div className='relative flex h-[250px] w-full justify-center'>
        <Image alt="pdlInstitute"  src="/images/dashImage.png" width={1540} height={250}/>
        <div className='absolute top-[140px]  text-white bg-black bg-opacity-50 px-4 py-1 rounded-md text-lg font-semibold'>
          Sadhak ID:{sdkData.sdkRegNo}
        </div>
      </div>
      <div className="overflow-auto p-6 max-h-[320px]" >
        <SadhakDashLayout/>
      </div>
    </div>    
  );
};

export default SadhakDashBoard;
