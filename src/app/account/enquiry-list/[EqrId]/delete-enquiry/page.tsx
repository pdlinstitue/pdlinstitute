"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/app/account/Loading';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';

interface EqrNameProps {
    eqrName:string
}

interface IEqrParams {
    params: Promise<{
        EqrId?: string;
    }>;
}

const DeleteEnquiry : React.FC <IEqrParams>= ({params}) => {

    const router = useRouter();
    const { EqrId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [enquirerName, setEnquirerName] = useState<EqrNameProps>({eqrName:''});

  
    useEffect(() => { 
    async function fetchEqrById() { 
    try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/enquiries/${EqrId}/view-enquiry`, {cache: "no-store"}); 
            const eqrData = await res.json(); 
            setEnquirerName(eqrData.eqrById);      
        } catch (error) { 
            console.error("Error fetching classData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchEqrById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
        try 
        {
            const response = await fetch(`${BASE_API_URL}/api/enquiries/${EqrId}/delete-enquiry`, {
                method: 'DELETE',
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/enquiry-list');
            }
        } catch (error) {
            toast.error('Error deleting enquiry.');
        } finally {
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
        <div className="formStyle w-[350px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-red-600 font-semibold">Alert !</h1>
                    <p className="text-center"> Won't be able to restore. Are you sure to delete?</p>
                    <p className="font-bold text-xl text-green-600">{enquirerName.eqrName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full" disabled={isSaving}>
                        {isSaving ? "Confirming..." : "Confirm"}
                    </button>
                    <button type="button" onClick={() => router.push('/account/enquiry-list')} className="btnRight w-full">Cancel</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DeleteEnquiry;
