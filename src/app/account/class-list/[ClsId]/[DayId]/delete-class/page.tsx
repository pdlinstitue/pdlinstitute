"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/app/account/Loading';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';

interface ClassNameProps {
    clsDay:string
}

interface IClassParams {
    params: Promise<{
        ClsId?: string;
        DayId:string;
    }>;
}

const DeleteClass : React.FC <IClassParams>= ({params}) => {

    const router = useRouter();
    const { ClsId, DayId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [className, setClassName] = useState<ClassNameProps>({clsDay:''});

  
    useEffect(() => { 
    async function fetchClassById() { 
    try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/classes/${ClsId}/${DayId}/view-class`, {cache: "no-store"}); 
            const classData = await res.json(); 
            setClassName(classData.clsById);      
        } catch (error) { 
            console.error("Error fetching classData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchClassById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
        try 
        {
            const response = await fetch(`${BASE_API_URL}/api/classes/${ClsId}/${DayId}/delete-class`, {
                method: 'DELETE',
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/class-list');
            }
        } catch (error) {
            toast.error('Error disabling class.');
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    };

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[350px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-red-600 font-semibold">Alert !</h1>
                    <p className="text-center"> Won't be able to restore. Are you sure to delete?</p>
                    <p className="font-bold text-xl text-green-600">{className.clsDay}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/class-list')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DeleteClass;
