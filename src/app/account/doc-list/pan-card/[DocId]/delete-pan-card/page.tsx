"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';

interface PanNameProps {
    sdkPanNbr:string
}

interface ICorParams {
    params: Promise<{
        DocId?: string;
    }>;
}

const DeletePan : React.FC <ICorParams>= ({params}) => {

  const router = useRouter();
  const { DocId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [panName, setPanName] = useState<PanNameProps>({sdkPanNbr:''});
  
    useEffect(() => { 
    async function fetchPanById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/documents/${DocId}/view-doc`, {cache: "no-store"}); 
                const panData = await res.json(); 
                setPanName(panData.docById);      
            } catch (error) { 
                console.error("Error fetching panData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchPanById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
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
                router.push('/account/doc-list/pan-card');
            }
        } catch (error) {
            toast.error('Error deleting pan card.');
        } finally {
            setIsSaving(false);
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
                    <p className="font-bold text-xl">PAN</p>
                    <p className="font-bold text-xl text-green-600">{panName.sdkPanNbr}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full" disabled={isSaving}>
                        {isSaving ? "Confirming" : "Confirm"}
                    </button>
                    <button type="button" onClick={() => router.push('/account/doc-list/pan-card')} className="btnRight w-full">Cancel</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DeletePan;
