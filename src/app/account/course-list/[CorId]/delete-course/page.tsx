"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface CorNameProps {
    coName:string
}

interface ICorParams {
    params: Promise<{
        CorId?: string;
    }>;
}

const DeleteCourse : React.FC <ICorParams>= ({params}) => {

  const router = useRouter();
  const { CorId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [courseName, setCourseName] = useState<CorNameProps>({coName:''});
  
    useEffect(() => { 
    async function fetchCourseById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course`, {cache: "no-store"}); 
                const courseData = await res.json(); 
                setCourseName(courseData.corById);      
            } catch (error) { 
                console.error("Error fetching courseData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchCourseById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/courses/${CorId}/delete-course`, {
                method: 'DELETE'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/course-list');
            }
        } catch (error) {
            toast.error('Error deleting course.');
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    }

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[300px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl p-3 text-red-600 font-semibold">Alert !</h1>
                    <p className="text-center">Won't be able to restore. Are you sure to delete?</p>
                    <p className="font-bold text-xl text-green-600">{courseName.coName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/course-list')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DeleteCourse;
