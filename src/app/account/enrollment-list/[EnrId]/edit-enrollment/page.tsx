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
        EnrId?: string
    }>;
}

interface EditEnrollmentProps {
    isCompleted:string,
    enrIncompRemarks:string,
    updatedBy:string
}

const EditEnrollment : React.FC<IEnrParams> = ({params}) => {

    const router = useRouter();
    const {EnrId} = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [enrData, setEnrData] = useState<EditEnrollmentProps>({isCompleted:'', enrIncompRemarks:'', updatedBy:''});
    const [status, setStatus] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({
        result: {
          _id: '',
          usrName: '',
          usrRole: '',
        },
      });
       
      useEffect(() => {
        try {
          const userId = Cookies.get("loggedInUserId") || '';
          const userName = Cookies.get("loggedInUserName") || '';
          const userRole = Cookies.get("loggedInUserRole") || '';
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
        const fetchEnrollmentData = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/enrollments/${EnrId}/view-enrollment`);    
                const data = await res.json();
                setEnrData(data.enrById);
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
            const response = await fetch(`${BASE_API_URL}/api/enrollments/${EnrId}/edit-enrollment`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    isCompleted:status, 
                    enrIncompRemarks: enrData.enrIncompRemarks,
                    updatedBy:loggedInUser.result._id
                }),
            });
            const post = await response.json();
            console.log(post);
            
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/complete-course');
            }
        } catch (error) {
            toast.error('Error updating completion status.');
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    }

  return (
    <div className='flex items-center justify-center'>
      <form className='formStyle w-auto my-24' onSubmit={handleSubmit}>
         <div className='flex flex-col gap-2'>
            <label>Completion Remarks:</label>
            <textarea rows={4} className='inputBox' name='enrIncompRemarks' value={enrData.enrIncompRemarks} onChange={handleChange}></textarea>
         </div>
         <div className='grid grid-cols-2 gap-1 items-center'>
            <button type='submit' className='btnRight' onClick={() => setStatus('Complete')}>Complete</button>
            <button type='submit' className='btnRight' onClick={() => setStatus('Incomplete')}>Incomplete</button>
         </div>
         <button type='button' className='btnLeft' onClick={()=>router.push('/account/complete-course')}>BACK</button>
      </form>
    </div>
  )
}

export default EditEnrollment;
