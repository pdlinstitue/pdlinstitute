"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface MatNameProps {
    matName:string
}

interface IMatParams {
    params: Promise<{
        MatId?: string;
    }>;
}

const DisableMaterial : React.FC <IMatParams>= ({params}) => {

  const router = useRouter();
  const { MatId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [materialName, setMaterialName] = useState<MatNameProps>({matName:''});
  
    useEffect(() => { 
    async function fetchMatById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/materials/${MatId}/view-material`, {cache: "no-store"}); 
                const matData = await res.json(); 
                setMaterialName(matData.matById);      
            } catch (error) { 
                console.error("Error fetching eventData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchMatById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/materials/${MatId}/disable-material`, {
                method: 'PATCH'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/study-materials');
            }
        } catch (error) {
            toast.error('Error disabling material.');
        }
    };

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[300px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this material?</p>
                    <p className="font-bold text-xl text-green-600">{materialName.matName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/study-materials')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableMaterial;
