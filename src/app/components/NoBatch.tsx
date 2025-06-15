'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BASE_API_URL } from '../utils/constant';
import Cookies from 'js-cookie';
import Loading from '../account/Loading';


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
  sdkId:string,
  corId:string,
  createdBy:string
}

const NoBatch : React.FC<INoBatchParams> = ({CourseId}) => {

  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrData, setEnrData] = useState<NoBatchProps>({prosMonth:'', prosShift:'', corId:'', prosWeek:0, prosOptMonth:'', prosOptShift:'', prosOptWeek:0, createdBy:'', sdkId:''});
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
            corId: CourseId,
            sdkId:loggedInUser.id,
            createdBy: loggedInUser.id,
          }),
        });
    
        const post = await response.json();
        console.log(post);
    
        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push(`/account/my-courses/${CourseId}/join-groups`);
        }
      } catch (error) {
        toast.error('Error enrolling parking batch.');
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
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
            <div className="grid grid-cols-2 gap-1 mt-4 w-full">
              <button type="submit" className="btnLeft" disabled={isSaving}>
                {isSaving ? "Submitting" : "Submit"}
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.back()}
              >
                BACK
              </button>
            </div>
        </form>
    </div>
  )
}

export default NoBatch;
