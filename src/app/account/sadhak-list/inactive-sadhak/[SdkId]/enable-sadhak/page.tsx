"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';
import Cookies from 'js-cookie';

interface SdkNameProps {
    sdkFstName:string,
    updatedBy:string
}

interface ISdkParams {
    params: Promise<{
        SdkId?: string;
    }>;
}

const EnableSadhak : React.FC <ISdkParams>= ({params}) => {

  const router = useRouter();
  const { SdkId } = use(params);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sadhakName, setSadhakName] = useState<SdkNameProps>({sdkFstName:'', updatedBy:''});
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
    async function fetchSadhakById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {cache: "no-store"}); 
                const sadhakData = await res.json(); 
                setSadhakName(sadhakData.sdkById);      
            } catch (error) { 
                console.error("Error fetching courseData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchSadhakById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/inactive-users/${SdkId}/enable-sadhak`, {
                method: 'PATCH',
                body: JSON.stringify({
                    updatedBy:loggedInUser.result?._id
                })
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/sadhak-list/inactive-sadhak');
            }
        } catch (error) {
            toast.error('Error enabling sadhak.');
        } finally{
            setIsSaving(false);
        }
    };

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
                    <p className="text-center">Are you sure to enable this Sadhak?</p>
                    <p className="font-bold text-xl text-green-600">{sadhakName.sdkFstName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full" disabled={isSaving}>
                       {isSaving ? "Confirming..." : "Confirm"}
                    </button>
                    <button type="button" onClick={() => router.push('/account/sadhak-list/inactive-sadhak')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default EnableSadhak;
