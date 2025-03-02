'use client';
import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { BsWhatsapp } from "react-icons/bs";
import { FaTelegram } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BASE_API_URL } from '../utils/constant';


interface INoBatchParams {
  CourseId:string
}

interface NoBatchProps {
  prosMonth:string,
  prosShift:string,
  corId:string,
  usrId:string
}

const NoBatch : React.FC<INoBatchParams> = ({CourseId}) => {

  const router = useRouter();
  const [enrData, setEnrData] = useState<NoBatchProps>({prosMonth:'', prosShift:'', corId:'', usrId:''})

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
    try 
      {
        const response = await fetch(`${BASE_API_URL}/api/my-courses/${CourseId}/prospect`, {
          method: 'POST',
          body: JSON.stringify({
            prosMonth:enrData.prosMonth,
            prosShift: enrData.prosShift,
            corId: CourseId,
            // usrId: data.usrId,
          }),
        });
    
        const post = await response.json();
        console.log(post);
    
        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/my-courses');
        }
  
    } catch (error) {
        toast.error('Error enrolling parking batch.');
     } 
    };

  return (
    <div className='flex justify-center'>
        <form className="formStyle w-[600px] my-24 items-center" onSubmit={handleSubmit}>
            <Image alt="ohh" src="/images/ohh.png" width={40} height={40} />
            <h1 className="text-2xl font-bold text-center text-orange-600 italic">
                No Batches Available
            </h1>
            <div className="text-center text-lg">
                <p>You can choose your preferred</p>
                <p>time.</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col items-center gap-1">
                    <label className="font-bold">MONTH</label>
                    <input type="month" name='prosMonth' value={enrData.prosMonth} onChange={handleChange} className="inputBox" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <label className="font-bold">SHIFT</label>
                    <select className="inputBox h-[46px]" name='prosShift' value={enrData.prosShift} onChange={handleChange}>
                        <option className="text-center" value="">
                        --- Select Shift ---
                        </option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-4 w-full">
              <button type="submit" className="btnLeft">
                SUBMIT
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.push("/account/my-courses")}
              >
                BACK
              </button>
            </div>
            <div className='flex justify-between gap-4 mt-4'>
                <button type='button' className='flex gap-2 italic'>
                    <BsWhatsapp size={24} className='text-green-600'/>
                    <p>Join WhatsApp Group</p>
                </button>
                <button type='button' className='flex gap-2 italic'>
                    <FaTelegram size={24} className='text-blue-500'/> 
                    <p>Join Telegram Group</p>
                </button>              
            </div>
        </form>
    </div>
  )
}

export default NoBatch;
