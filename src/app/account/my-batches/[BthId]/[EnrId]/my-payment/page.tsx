'use client';
import React, { FormEvent, use, useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface IEnrParams{
    params: Promise<{
        BthId:string,
        EnrId: string
    }>;
}

interface ViewPaymentProps {
    _id?: string;
    enrSrnShot: string;
    enrRemarks: string;
    enrTnsNo:string;
    updatedBy?: string;
}

const MyPayment : React.FC<IEnrParams> = ({params}) => {

    const router = useRouter();
    const {EnrId} = use(params);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [enrData, setEnrData] = useState<ViewPaymentProps>({_id:"", enrSrnShot:"", enrRemarks:"", enrTnsNo:"", updatedBy:""});
    const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    usrName: "",
    usrRole: "",
    isAdmin: "",
  });

  useEffect(() => {
  try {
    const cookie = Cookies.get("loggedInUser");
    if (cookie) {
        const parsed = JSON.parse(cookie);
        setLoggedInUser({
        id: parsed.id || "",
        usrName: parsed.usrName || "",
        usrRole: parsed.usrRole || "",
        isAdmin: parsed.isAdmin || "", 
      });
    }
    } catch (error) {
      console.error("Error parsing loggedInUser cookie:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

    useEffect(() => {
        const fetchEnrollmentData = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/enrollments/${EnrId}/view-enrollment`);    
                const data = await res.json();
                setEnrData(data?.enrById);
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
    setIsSaving(true);
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/enrollments/${EnrId}/view-enrollment`, {
                method: 'PATCH',
                body: JSON.stringify({  
                    enrSrnShot:enrData.enrSrnShot,
                    enrTnsNo:enrData.enrTnsNo,
                    updatedBy:loggedInUser.id
                }),
            });

            const post = await response.json();
            
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/my-batches');
            }
        } catch (error) {
            toast.error('Error updating paymentData.');
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
    <div className='flex items-center justify-center'>
      <form className='formStyle  w-[450px] my-3' onSubmit={handleSubmit}>
         <div className=' bg-gray-200 w-auto h-auto rounded-md'>
            <Image alt='paymentImg' src={enrData?.enrSrnShot} width={420} height={250}/>
         </div>
         <div className='flex flex-col gap-2'>
            <label>Trans No:</label>
            <input className='inputBox' name='enrTnsNo' value={enrData?.enrTnsNo} onChange={handleChange}></input>
         </div>
         <div className='flex flex-col gap-2'>
            <label>Remarks:</label>
            <textarea className='inputBox' name='enrRemarks' value={enrData?.enrRemarks} onChange={handleChange} disabled placeholder='Remarks'></textarea>
         </div>
         <div className='grid grid-cols-1 md:grid-cols-2 gap-1 items-center mt-3'>
            <button type='submit' className='btnLeft'  disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
            </button>
            <button type='button' className='btnLeft' onClick={()=>router.push('/account/my-batches')}>BACK</button>
         </div>
      </form>
    </div>
  )
}

export default MyPayment;
