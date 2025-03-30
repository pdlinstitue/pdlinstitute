"use client";
import Loading from '@/app/account/Loading';
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import React, { use, useState, useEffect } from 'react';


interface IEqrParams {
    params:Promise<{
        EqrId:string
    }>
}

interface EnquiryDataProps {
    _id?:string,
    eqrMessage:string
}

const EnquiryMessage : React.FC<IEqrParams> = ({params}) => {

    const {EqrId} = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [enquiryData, setEnquiryData] = useState<EnquiryDataProps>({eqrMessage:''});

    useEffect(() => {
      async function fetchEnquiryById() {
        try {
          const res = await fetch(`${BASE_API_URL}/api/enquiries/${EqrId}/view-enquiry`, { cache: "no-store" });
          const eqrData = await res.json();
          setEnquiryData(eqrData?.eqrById);
        } catch (error) {
            console.error("Error fetching course data:", error);
        } finally {
            setIsLoading(false);
        }
      }
      fetchEnquiryById();
      }, []);
    
      if(isLoading){
        return <div>
            <Loading/>
        </div>
      }

  return (
    <div className='flex items-center justify-center my-24'>
      <div className='formStyle w-[400px]'>
        <div className='flex flex-col gap-4'>
            <h1 className='py-2 px-4 bg-gray-200 text-xl font-bold uppercase text-center'>Message</h1>
            <div>{enquiryData.eqrMessage}</div>
        </div>
        <button type='button' className='btnLeft' onClick={() => router.push("/account/enquiry-list")}>BACK</button>
      </div>
    </div>
  )
}

export default EnquiryMessage;


