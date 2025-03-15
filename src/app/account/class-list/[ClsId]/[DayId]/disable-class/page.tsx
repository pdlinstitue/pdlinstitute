"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
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

const DisableClass : React.FC <IClassParams>= ({params}) => {

    const router = useRouter();
    const { ClsId, DayId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [className, setClassName] = useState<ClassNameProps>({clsDay:''});
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
    async function fetchClassById() { 
    try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/classes/${ClsId}/${DayId}/view-class`, {cache: "no-store"}); 
            const classData = await res.json(); 
            setClassName(classData.clsById);      
        } catch (error) { 
            console.error("Error fetching eventData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchClassById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
        try 
        {
            const response = await fetch(`${BASE_API_URL}/api/classes/${ClsId}/${DayId}/disable-class`, {
                method: 'PATCH',
                body: JSON.stringify({
                    disabledBy: loggedInUser.result._id
                })
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
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this class?</p>
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

export default DisableClass;
