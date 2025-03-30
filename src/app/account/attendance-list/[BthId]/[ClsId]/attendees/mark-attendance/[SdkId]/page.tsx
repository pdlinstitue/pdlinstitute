'use client';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { FormEvent, use, useEffect, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '@/app/account/Loading';


interface IAttdParams {
  params:Promise<{
    BthId:string,
    ClsId:string,
    SdkId:string
  }>
}

interface MarkAttendanceProps {
  status:string,
  absRemarks:string,
  markedBy:string
}

const MarkAttendance : React.FC<IAttdParams> = ({params}) => {

  const router = useRouter();
  const {BthId, ClsId, SdkId} = use(params);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('')
  const [attdStatus, setAttdStatus] = useState<MarkAttendanceProps>({status:'', absRemarks:'', markedBy:''});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttdStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMarkAttd = (status:string) => {
    setStatus(status);
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {

      const response = await fetch(`${BASE_API_URL}/api/mark-attendance/${BthId}/${ClsId}/${SdkId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status:status,
          absRemarks:attdStatus.absRemarks,
          markedBy:loggedInUser.result._id
        }),
      });

      const post = await response.json();
      console.log(post);

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push(`/account/attendance-list/${BthId}/${ClsId}/attendees`);
      }
    } catch (error) {
      toast.error("Error marking attendance.");
    }
  };

  if(isLoading){
    return<div>
      <Loading/>
    </div>
  }

  

  return (
    <div className='flex justify-center items-center'>
      <form className='formStyle w-[350px] my-24' onSubmit={handleSubmit}>
        <h1 className='p-2 bg-gray-200 font-bold uppercase text-center'>
          Mark Attendance
        </h1>
        <div className='grid grid-cols-2 gap-4 p-2'>
          <div className='flex items-center gap-4'>
            <input
              type="radio"
              name="status"
              onClick={()=>handleMarkAttd("Present")}
            />
            <span>Present</span>
          </div>
          <div className='flex items-center gap-4'>
            <input
              type="radio"
              name="status"
              onClick={()=>handleMarkAttd("Absent")}
            />
            <span>Absent</span>
          </div>
        </div>
        {
          status === "Absent" && (
            <div className='flex flex-col gap-2'>
              <label className='font-bold'>Remarks:</label>
              <select className='inputBox text-center' name='absRemarks' value={attdStatus.absRemarks} onChange={handleChange}>
                <option value='' className='text-center'> --- Choose Reason --- </option>
                <option value='Video off'>Video off</option>
                <option value='Light off'>Light off</option>
                <option value='Sadhak-N/A'>Sadhak-N/A</option>
                <option value='Sadhak-N/P'>Sadhak-N/P</option>
                <option value='Incorrect Name'>Incorrect Name</option>
              </select>
            </div>
          )
        }
        <div className='grid grid-cols-2 gap-1'>
          <button type='submit' className='btnLeft'>SUBMIT</button>
          <button type='button' className='btnRight' onClick={()=>router.push(`/account/attendance-list/${BthId}/${ClsId}/attendees`)}>BACK</button>
        </div>
      </form>
    </div>
  )
}

export default MarkAttendance;
