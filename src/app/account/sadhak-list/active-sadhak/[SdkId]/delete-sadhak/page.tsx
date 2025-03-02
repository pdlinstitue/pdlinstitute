"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import Loading from "@/app/account/Loading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DelSdkParams {
    params: Promise<{
        SdkId?: string;
    }>;
}

interface SadhakNameProps {
    _id: string,
    sdkFstName:string
}

const DeleteSadhak: React.FC<DelSdkParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { SdkId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [sadhakName, setSadhakName] = useState<SadhakNameProps>({_id:'', sdkFstName:''});
    
    useEffect(() => { 
    async function fetchSdkById() { 
        try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, {cache: "no-store"}); 
            const SdkData = await res.json(); 
            setSadhakName(SdkData.sdkById);      
        } catch (error) { 
            console.error("Error fetching sdkData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchSdkById(); 
    }, []);
    
    const handleDelSdk = async (): Promise<void> => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/users/${SdkId}/delete-sadhak`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/sadhak-list/active-sadhak');
            }
        } catch (error) {
            toast.error("Sadhak deletion failed.");
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
      }

    return (
        <div>
            <div className="flex w-[350px] mx-auto rounded-md shadow-lg p-9 border-[1.5px] border-orange-500 my-24">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl p-3 text-center text-red-600 font-semibold">Alert !</h1>
                        <p className="text-center">
                            Won't be able to restore. Are you sure to delete?
                        </p>
                        <p className='text-green-600 font-bold text-xl'>{sadhakName.sdkFstName}</p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelSdk} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/sadhak-list/active-sadhak')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteSadhak;
