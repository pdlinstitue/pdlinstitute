"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ViewAssignmentProps {
    _id:string,
    asnName: string,
    asnType: string,
    corId:string,
    asnLink:string,
    asnFile:string,
    asnOrder:string,
    usrId?: string
}

interface IAsnParams {
    params: Promise<{
        AsnId: string;
    }>;
}

const ViewAssignment:React.FC<IAsnParams> = ({params}) => {

  const { AsnId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [assignmentData, setAssignmentData] = useState<ViewAssignmentProps | null>(null);


  useEffect(() => {
  async function fetchAssignmentData() {
  try 
    {
        const res = await fetch(`${BASE_API_URL}/api/assignments/${AsnId}/view-assignment`, { cache: "no-store" });
        const assignmentById = await res.json();
        setAssignmentData(assignmentById.asnById);
    } catch (error) {
        console.error("Error fetching assignment data:", error);
    }  finally {
        setIsLoading(false);
    }
    }
    fetchAssignmentData();
   }, []); 

   if(isLoading){
    return<div>
        <Loading/>
    </div>
   }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='formStyle w-auto'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-center font-semibold uppercase bg-gray-200 p-2'>
                    {assignmentData?.asnName}
                </h1>
                {assignmentData?.asnType === "Audio" || assignmentData?.asnType === "Video" &&
                (
                    <div className=' bg-gray-200 p-4'>
                        {assignmentData.asnLink}
                    </div> 
                )  
                }
                {assignmentData?.asnType === "File/Image" &&
                (
                    <iframe className=' bg-gray-200 p-4' title='Material Content'>
                        {assignmentData.asnFile}
                    </iframe> 
                )  
                }  
                <h1 className='text-center font-semibold uppercase bg-gray-200 p-2'>
                    {assignmentData?.corId}
                </h1>          
            </div>
            <div>
                <button type='button' className='btnLeft' onClick={(e:any)=> router.push('/account/assignment-sent')}>
                    BACK
                </button>
            </div>
      </div>
    </div>
  )
}

export default ViewAssignment;
