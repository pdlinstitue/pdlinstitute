"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/account/Loading";

interface DelPrcParams {
    params: Promise<{
        PrcId?: string;
    }>;
}

interface PracticeNameProps {
    _id: string,
    prcName:string
}

const DelPracticeClass: React.FC<DelPrcParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { PrcId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [practiceName, setPracticeName] = useState<PracticeNameProps>({_id:'', prcName:''});
    
    useEffect(() => { 
    async function fetchPrcClassById() { 
        try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/course-practice/${PrcId}/view-practice-class`, {cache: "no-store"}); 
            const practiceData = await res.json(); 
            setPracticeName(practiceData.prcById); 
                
        } catch (error) { 
            console.error("Error fetching eventData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchPrcClassById(); 
    }, []);
    
    const handleDelPracticeClass = async (): Promise<void> => {
    setIsSaving(true);
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/course-practice/${PrcId}/delete-practice-class`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/course-practice');
            }
        } catch (error) {
            toast.error("Practice class deletion failed.");
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
        <div>
            <div className="flex w-[350px] mx-auto rounded-md shadow-lg p-9 border-[1.5px] border-orange-500 my-24">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl p-3 text-center text-red-600 font-semibold">Alert !</h1>
                        <p className="text-center">
                            Won't be able to restore. Are you sure to delete?
                        </p>
                        <p className='text-green-600 font-bold text-xl'>
                            {practiceName.prcName}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelPracticeClass} className="btnLeft w-full" disabled={isSaving}>
                            {isSaving ? "Confirming" : "Confirm"}
                        </button>
                        <button type="button" onClick={() => router.push('/account/course-practice')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelPracticeClass;
