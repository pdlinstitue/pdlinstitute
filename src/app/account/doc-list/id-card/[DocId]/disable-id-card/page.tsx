"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface IDNumberProps {
    sdkIdNbr:string
}

interface IDocParams {
    params: Promise<{
        DocId?: string;
    }>;
}

const DisableIDCard : React.FC <IDocParams>= ({params}) => {

    const router = useRouter();
    const { DocId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [idNumber, setIdNumber] = useState<IDNumberProps>({sdkIdNbr:''});
  
    useEffect(() => { 
    async function fetchPanById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/documents/${DocId}/view-doc`, {cache: "no-store"}); 
                const idData = await res.json(); 
                setIdNumber(idData.docById);      
            } catch (error) { 
                console.error("Error fetching idData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchPanById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/documents/${DocId}/disable-doc`, {
                method: 'PATCH'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/doc-list/id-card');
            }
        } catch (error) {
            toast.error('Error disabling id card.');
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
                    <p className="text-center">Do you really want to disable this doc?</p>
                    <p className="font-bold text-xl">ID CARD</p>
                    <p className="font-bold text-xl text-green-600">{idNumber.sdkIdNbr}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/doc-list/id-card')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableIDCard;
