"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface SdkNameProps {
    sdkFstName:string
}

interface ISdkParams {
    params: Promise<{
        SdkId?: string;
    }>;
}

const DisableSadhak : React.FC <ISdkParams>= ({params}) => {

  const router = useRouter();
  const { SdkId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [sadhakName, setSadhakName] = useState<SdkNameProps>({sdkFstName:''});
  
    useEffect(() => { 
    async function fetchSadhakById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {cache: "no-store"}); 
                const sadhakData = await res.json(); 
                setSadhakName(sadhakData.sdkById);      
            } catch (error) { 
                console.error("Error fetching SadhakData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchSadhakById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/users/${SdkId}/disable-sadhak`, {
                method: 'PATCH'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/sadhak-list/active-sadhak');
            }
        } catch (error) {
            toast.error('Error disabling sadhak.');
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
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this Sadhak?</p>
                    <p className="font-bold text-xl text-green-600">{sadhakName.sdkFstName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/sadhak-list/active-sadhak')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableSadhak;
