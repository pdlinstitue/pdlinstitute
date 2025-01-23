"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import Loading from "@/app/account/Loading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DelCatParams {
    params: Promise<{
        EveId?: string;
    }>;
}

interface EventNameProps {
    _id: string,
    eveName:string
}

const DelEvent: React.FC<DelCatParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { EveId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [eventName, setEventName] = useState<EventNameProps>({_id:'', eveName:''});
    
    useEffect(() => { 
    async function fetchEventById() { 
        try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/events/${EveId}/view-event`, {cache: "no-store"}); 
            const eventData = await res.json(); 
            setEventName(eventData.eveById);      
        } catch (error) { 
            console.error("Error fetching eventData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchEventById(); 
    }, []);
    
    const handleDelCat = async (): Promise<void> => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/events/${EveId}/delete-event`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/event-list');
            }
        } catch (error) {
            toast.error("Event deletion failed.");
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
                        <p className='text-green-600 font-bold text-xl'>{eventName.eveName}</p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelCat} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/event-list')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelEvent;
