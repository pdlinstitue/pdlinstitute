"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface CorNameProps {
    coNick:string
}

interface ICorParams {
    params: Promise<{
        CorId?: string;
    }>;
}

const DisableCourse : React.FC <ICorParams>= ({params}) => {

    const router = useRouter();
    const { CorId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [courseName, setCourseName] = useState<CorNameProps>({coNick:''});
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
    setIsSaving(true);
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/courses/${CorId}/disable-course`, {
                method: 'PATCH',
                body: JSON.stringify({
                    disabledBy:loggedInUser.result._id
                })
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/course-list');
            }
        } catch (error) {
            toast.error('Error disabling course.');
        } finally {
            setIsSaving(false);
        }
    }

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    };

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[300px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this course?</p>
                    <p className="font-bold text-xl text-green-600">{courseName.coNick}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full" disabled={isSaving}>
                       {isSaving ? "Confirming..." : "Confirm"}
                    </button>
                    <button type="button" onClick={() => router.push('/account/course-list')} className="btnRight w-full">Cancel</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableCourse;
