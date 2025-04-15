'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '../account/Loading';
import { BASE_API_URL } from '../utils/constant';
import Cookies from 'js-cookie';


interface INoBatchParams {
  CourseId:string
}

interface NoBatchProps {
  prosMonth:string,
  prosShift:string,
  prosWeek:number,
  prosOptMonth:string,
  prosOptShift:string,
  prosOptWeek:number,
  corId:string,
  sdkId:string,
  createdBy:string
}

const NoBatchAdmin : React.FC<INoBatchParams> = ({CourseId}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [enrData, setEnrData] = useState<NoBatchProps>({prosMonth:'', prosShift:'', corId:'', prosWeek:0, prosOptMonth:'', prosOptShift:'', prosOptWeek:0, sdkId:'', createdBy:''});
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

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setEnrData((prev)=>{
      return {
        ...prev, [name]:value
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();   
    setIsSaving(true);
    try 
      {
        const response = await fetch(`${BASE_API_URL}/api/my-courses/${CourseId}/prospect`, {
          method: 'POST',
          body: JSON.stringify({
            prosMonth:enrData.prosMonth,
            prosShift: enrData.prosShift,
            prosWeek:enrData.prosWeek,
            prosOptMonth:enrData.prosOptMonth,
            prosOptShift: enrData.prosOptShift,
            prosOptWeek:enrData.prosOptWeek,
            sdkId:enrData.sdkId,
            corId: CourseId,
            createdBy: loggedInUser.result._id,
          }),
        });
    
        const post = await response.json();
        console.log(post);
    
        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push('/account/course-list');
        }
      } catch (error) {
        toast.error('Error enrolling parking batch.');
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <div className='flex justify-center'>
        <form className="formStyle w-auto my-24" onSubmit={handleSubmit}>
            <div className='flex flex-col items-center'>
              <Image alt="ohh" src="/images/ohh.png" width={40} height={40} />
              <h1 className="text-xl font-bold text-center text-orange-600 italic">
                  No Batches Available
              </h1>
              <div className="text-center text-lg">
                  <p>You can choose your preferred time.</p>
              </div>
            </div>      
            <div className="grid grid-cols-3 gap-1">
              <div className="flex flex-col gap-1">
                  <label className="font-bold">MONTH</label>
                  <input type="month" name='prosMonth' value={enrData.prosMonth} onChange={handleChange} className="inputBox" required/>
              </div>
              <div className="flex flex-col gap-1">
                  <label className="font-bold">WEEK</label>
                  <input type="number" name='prosWeek' value={enrData.prosWeek} onChange={handleChange} className="inputBox h-[46px]" required/>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">SHIFT</label>
                <select className="inputBox h-[46px]" name='prosShift' value={enrData.prosShift} onChange={handleChange} required>
                    <option className="text-center" value="">--- Select Shift ---</option>
                    <option value="Any Shift">Any Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex flex-col gap-1">
                  <label className="font-bold">OPTIONAL MONTH</label>
                  <input type="month" name='prosOptMonth' value={enrData.prosOptMonth} onChange={handleChange} className="inputBox" />
              </div>
              <div className="flex flex-col gap-1">
                  <label className="font-bold">OPTIONAL WEEK</label>
                  <input type="number" name='prosOptWeek' value={enrData.prosOptWeek} onChange={handleChange} className="inputBox h-[46px]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">OPTIONAL SHIFT</label>
                <select className="inputBox h-[46px]" name='prosOptShift' value={enrData.prosOptShift} onChange={handleChange}>
                    <option className="text-center" value="">--- Select Shift ---</option>
                    <option value="Any Shift">Any Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold">SDK ID:</label>
                <input type="text" name='sdkId' value={enrData.sdkId} onChange={handleChange} className="inputBox h-[46px]" required/>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-4 w-full">
              <button type="submit" className="btnLeft" disabled={isSaving}>
                {isSaving ? "Submitting" : "Submit"}
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.push("/account/course-list")}
              >
                BACK
              </button>
            </div>
        </form>
    </div>
  )
}

export default NoBatchAdmin;
