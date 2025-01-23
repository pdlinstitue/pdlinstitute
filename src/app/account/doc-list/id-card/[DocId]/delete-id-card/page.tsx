"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface IdCardProps {
    sdkIdNbr:string
}

interface ICorParams {
    params: Promise<{
        DocId?: string;
    }>;
}

const DeleteIDCard : React.FC <ICorParams>= ({params}) => {

  const router = useRouter();
  const { DocId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [idCardNumber, setIdCardNumber] = useState<IdCardProps>({sdkIdNbr:''});
  
    useEffect(() => { 
    async function fetchPanById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/documents/${DocId}/view-doc`, {cache: "no-store"}); 
                const idData = await res.json(); 
                setIdCardNumber(idData.docById);      
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
            const response = await fetch(`${BASE_API_URL}/api/documents/${DocId}/delete-doc`, {
                method: 'DELETE'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/doc-list/id-card');
            }
        } catch (error) {
            toast.error('Error deleting id card.');
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
                    <p className="font-bold text-xl">ID CARD</p>
                    <p className="font-bold text-xl text-green-600">{idCardNumber.sdkIdNbr}</p>
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

export default DeleteIDCard;
