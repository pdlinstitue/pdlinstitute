"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/app/account/Loading';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';


interface IEveParams {
    params: Promise<{
        EveId?: string;
    }>;
}

interface EventNameProps {
    _id: string,
    eveName:string
}

const DisableEvent : React.FC <IEveParams>= ({params}) => {

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

   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
        const response = await fetch(`${BASE_API_URL}/api/events/${EveId}/disable-event`, {
            method: 'PATCH'
        });

        const post = await response.json();
        console.log(post);
        
        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/event-list');
        }
    } catch (error) {
        toast.error('Error disabling event.');
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
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-center text-yellow-500 font-semibold">Warning !</h1>
                    <div className="text-center">
                        <p>Do you really want to disable this event?</p>
                        <p className='text-green-600 font-bold text-xl'>{eventName.eveName}</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/event-list')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableEvent;
