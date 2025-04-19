'use client';
import React, { FormEvent, use, useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface IReEnrParams{
    params: Promise<{
        ReqId?: string
    }>;
}

interface ViewReEnrollmentProps {
    reqReason: string;
    updatedBy: string;
    reqStatus: string;
}

const ViewReEnrollmentRequest : React.FC<IReEnrParams> = ({params}) => {

    const router = useRouter();
    const {ReqId} = use(params);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [reEnrData, setReEnrData] = useState<ViewReEnrollmentProps>({reqStatus:"", reqReason:"", updatedBy:""});
    const [status, setStatus] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({
        result: {
          _id: "",
          usrName: "",
          usrRole: "",
        },
      });
    
      useEffect(() => {
        try {
          const userId = Cookies.get("loggedInUserId") || "";
          const userName = Cookies.get("loggedInUserName") || "";
          const userRole = Cookies.get("loggedInUserRole") || "";
          setLoggedInUser({
            result: {
              _id: userId,
              usrName: userName,
              usrRole: userRole,
            },
          });
        } catch (error) {
          console.error("Error fetching loggedInUserData.");
        } finally {
          setIsLoading(false);
        }
      }, []);

    useEffect(() => {
    const fetchReEnrollmentDataById = async () => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/request-to-re-enroll/${ReqId}/view-request`);    
            const data = await res.json();
            setReEnrData(data?.reqById);
        } catch (error) {
            console.error("Error fetching reEnrData: ", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchReEnrollmentDataById();
    },[]);

    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setReEnrData((prev) =>{
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
            const response = await fetch(`${BASE_API_URL}/api/request-to-re-enroll/${ReqId}/approve-request`, {
                method: 'PATCH',
                body: JSON.stringify({ 
                    reqStatus:status, 
                    updatedBy:loggedInUser.result._id
                }),
            });

            const post = await response.json();
            
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/re-enrollment-list');
            }
        } catch (error) {
            toast.error('Error updating enrData.');
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
         <div className='flex flex-col gap-2'>
            <label>Reason:</label>
            <textarea className='inputBox' name='reqStatus' value={reEnrData?.reqReason} onChange={handleChange} placeholder='Remarks'></textarea>
         </div>
         <div className='grid grid-cols-3 gap-1 items-center mt-3'>
            <button type='submit' className='btnLeft' onClick={() => setStatus('Approved')} disabled={isSaving}>
                {isSaving ? "Approving..." : "Approve"}
            </button>
            <button type='submit' className='btnRight' onClick={() => setStatus('Rejected')} disabled={isSaving}>
                {isSaving ? "Rejecting..." : "Reject"}
            </button>
            <button type='button' className='btnLeft' onClick={()=>router.push('/account/re-enrollment-list')}>BACK</button>
         </div>
      </form>
    </div>
  )
}

export default ViewReEnrollmentRequest;
