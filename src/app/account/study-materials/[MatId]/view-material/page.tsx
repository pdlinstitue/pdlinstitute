"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ViewMaterialProps {
    matName: String,
    matType: String,
    corId:String,
    matLink:String,
    matFile:String
}

interface IMatParams {
    params: Promise<{
        MatId: string;
    }>;
}

const ViewMaterial:React.FC<IMatParams> = ({params}) => {

  const { MatId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [matData, setMatData] = useState<ViewMaterialProps | null>(null);


  useEffect(() => {
  async function fetchMatData() {
  try 
    {
        const res = await fetch(`${BASE_API_URL}/api/materials/${MatId}/view-material`, { cache: "no-store" });
        const materialById = await res.json();
        setMatData(materialById.matById);
    } catch (error) {
        console.error("Error fetching course data:", error);
    }  finally {
        setIsLoading(false);
    }
    }
    fetchMatData();
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
                    {matData?.matName}
                </h1>
                {matData?.matType === "Audio" || matData?.matType === "Video" &&
                (
                    <div className=' bg-gray-200 p-4'>
                        {matData.matLink}
                    </div> 
                )  
                }
                {matData?.matType === "File/Image" &&
                (
                    <iframe className=' bg-gray-200 p-4' title='Material Content'>
                        {matData.matFile}
                    </iframe> 
                )  
                }  
                <h1 className='text-center font-semibold uppercase bg-gray-200 p-2'>
                    {matData?.corId}
                </h1>          
            </div>
            <div>
                <button type='button' className='btnLeft' onClick={(e:any)=> router.push('/account/study-materials')}>
                    BACK
                </button>
            </div>
      </div>
    </div>
  )
}

export default ViewMaterial;
