'use client';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { FormEvent, use, useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';
import { BASE_API_URL } from '@/app/utils/constant';


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
  updatedBy:string
}

const AmendAttendance : React.FC<IAttdParams> = ({params}) => {

  const router = useRouter();
  const {BthId, ClsId, SdkId} = use(params);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [attdStatus, setAttdStatus] = useState<MarkAttendanceProps>({status:'', absRemarks:'', updatedBy:''});
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

  useEffect(() => {
    async function fetchAttdData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/mark-attendance/${BthId}/${ClsId}/${SdkId}`, {
          cache: "no-store",
        });
  
        if (!res.ok) throw new Error("Failed to fetch attendance data");
  
        const attData = await res.json();
  
        setAttdStatus({
          status: attData.attendance[0]?.status || "", // ✅ Use optional chaining & fallback values
          absRemarks: attData.attendance[0]?.absRemarks || "",
          updatedBy: attData.attendance[0]?.updatedBy || "", // ✅ Ensure `updatedBy` is handled
        });
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    if (BthId && ClsId && SdkId) { // ✅ Ensure IDs are valid before fetching
      fetchAttdData();
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    try {

      const response = await fetch(`${BASE_API_URL}/api/mark-attendance/${BthId}/${ClsId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sdkIds:[SdkId],
          status:status,
          absRemarks:attdStatus.absRemarks,
          updatedBy:loggedInUser.result._id
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
      <form className='formStyle w-[350px] my-24' onSubmit={handleSubmit}>
        <h1 className='p-2 bg-gray-200 font-bold uppercase text-center'>
          Amend Attendance
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
                <option value='Incorrect Name'>Incorrect Name</option>
              </select>
            </div>
          )
        }
        <div className='grid grid-cols-2 gap-1'>
          <button type='submit' className='btnLeft' disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button type='button' className='btnRight' onClick={()=>router.push(`/account/attendance-list/${BthId}/${ClsId}/attendees`)}>BACK</button>
        </div>
      </form>
    </div>
  )
}

export default AmendAttendance;
