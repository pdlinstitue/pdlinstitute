'use client';
import React, { FormEvent, use, useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';

interface IEnrParams{
    params: Promise<{
        EnrId?: string
    }>;
}

interface ViewEnrollmentProps {
    _id?: string;
    enrSrnShot: string;
    enrRemarks: string;
    enrTnsNo:string;
    usrId?: string;
}

const ViewEnrollment : React.FC<IEnrParams> = ({params}) => {

    const router = useRouter();
    const {EnrId} = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [enrData, setEnrData] = useState<ViewEnrollmentProps>({_id:"", enrSrnShot:"", enrRemarks:"", enrTnsNo:"", usrId:""});
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchEnrollmentData = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/enrollments/${EnrId}/view-enrollment`);    
                const data = await res.json();
                setEnrData(data.enrById);
                console.log(data.enrById);
            } catch (error) {
                console.error("Error fetching enrData: ", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEnrollmentData();
    },[]);

    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setEnrData((prev) =>{
            return {
                ...prev, [name]: value
            }
        }); 
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); 
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/enrollments/${EnrId}/view-enrollment`, {
                method: 'PATCH',
                body: JSON.stringify({ 
                    isApproved:status, 
                    enrRemarks: enrData.enrRemarks
                }),
            });
            const post = await response.json();
            console.log(post);
            
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/enrollment-list');
            }
        } catch (error) {
            toast.error('Error updating enrData.');
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    }

  return (
    <div className='flex items-center justify-center'>
      <form className='formStyle  w-[450px] my-3' onSubmit={handleSubmit}>
         <div className=' bg-gray-200 w-auto h-auto rounded-md'>
            <Image alt='paymentImg' src="/#" width={420} height={250}/>
         </div>
         <div className='flex flex-col gap-2'>
            <label>Trans No:</label>
            <input className='inputBox' name='enrTnsNo' value={enrData.enrTnsNo} onChange={handleChange}></input>
         </div>
         <div className='flex flex-col gap-2'>
            <label>Remarks:</label>
            <textarea className='inputBox' name='enrRemarks' value={enrData.enrRemarks} onChange={handleChange} placeholder='Remarks'></textarea>
         </div>
         <div className='grid grid-cols-3 gap-1 items-center mt-3'>
            <button type='submit' className='btnLeft' onClick={() => setStatus('Approved')}>Approve</button>
            <button type='submit' className='btnRight' onClick={() => setStatus('Rejected')}>Reject</button>
            <button type='button' className='btnLeft' onClick={()=>router.push('/account/enrollment-list')}>BACK</button>
         </div>
      </form>
    </div>
  )
}

export default ViewEnrollment;
