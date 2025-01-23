"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface AsnNameProps {
    asnName:string
}

interface IAsnParams {
    params: Promise<{
        AsnId?: string;
    }>;
}

const DisableAssignment : React.FC <IAsnParams>= ({params}) => {

  const router = useRouter();
  const { AsnId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [assignName, setAssignName] = useState<AsnNameProps>({asnName:''});
  
    useEffect(() => { 
    async function fetchAssignmentById() { 
    try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/assignments/${AsnId}/view-assignment`, {cache: "no-store"}); 
            const asnData = await res.json(); 
            setAssignName(asnData.asnById);      
        } catch (error) { 
            console.error("Error fetching asnData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchAssignmentById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/assignments/${AsnId}/disable-assignment`, {
                method: 'PATCH'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/assignment-sent');
            }
        } catch (error) {
            toast.error('Error disabling assignment.');
        }
    };

    if(isLoading){
        return<div>
            <Loading/>
        </div>
    }

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[350px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this assignment?</p>
                    <p className="font-bold text-xl text-green-600">{assignName.asnName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/assignment-sent')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableAssignment;
