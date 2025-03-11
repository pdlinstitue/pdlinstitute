"use client";
import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BASE_API_URL } from '@/app/utils/constant';
import Cookies from 'js-cookie';

interface AddNewPracticeProps {
  prcName:string,
  prcImg:string,
  prcLang:string,
  prcDays:string,
  prcStartsAt:string,
  prcEndsAt:string,
  prcLink:string,
  prcWhatLink: string,
  usrId?:string
 }

const AddNewPractice = () => {

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [pracDays, setPracDays] = useState<string[] | null>([])
  const [data, setData] = useState<AddNewPracticeProps>({prcName:'', prcLang:'', prcDays:'', prcStartsAt:'', prcEndsAt:'', prcLink:'', prcWhatLink:'',  prcImg:'', usrId:''});
  const practiceDays : string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  const loggedInUser = {
    result:{
      _id:Cookies.get("loggedInUserId"), 
      usrName:Cookies.get("loggedInUserName"),
      usrRole:Cookies.get("loggedInUserRole"),
    }
  };


  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) =>{
        return {
            ...prev, [name]: value
        }
    }); 
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, day: string) => {
    const { checked } = event.target;
    let updatedDays = [...(pracDays || [])];  
    if (checked) {
      updatedDays.push(day);
    } else {
      updatedDays = updatedDays.filter(d => d !== day);
    }
    setPracDays(updatedDays);
  };
  

    const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error
        
    if (!data.prcName.trim()) {
        setErrorMessage('Class name is must.');    
    } else if (!data.prcStartsAt.trim()) {
        setErrorMessage('Please provide start time.');    
    } else if (!data.prcEndsAt.trim()) {
        setErrorMessage('Please provide end time.');    
    } else if (!data.prcLang.trim()) {
        setErrorMessage('Please Choose language.');    
    } else if (!data.prcLink.trim()) {
        setErrorMessage('Please provide meeting link.');    
    } else {
      try 
      {
        const response = await fetch(`${BASE_API_URL}/api/course-practice`, {
        method: 'POST',
        body: JSON.stringify({ 
          prcName:data.prcName,
          prcImg:data.prcImg,
          prcLang:data.prcLang,
          prcDays:pracDays,
          prcStartsAt:data.prcStartsAt,
          prcEndsAt:data.prcEndsAt,
          prcLink:data.prcLink,
          prcWhatLink: data.prcWhatLink,
          createdBy: loggedInUser.result._id
        }),
      });
  
      const post = await response.json();
      console.log(post);
  
      if (post.success === false) {
          toast.error(post.msg);
      } else {
          toast.success(post.msg);
          router.push('/account/course-practice');
        }
      } catch (error) {
        toast.error('Error creating practice class.');
      } 
    }
  };

  return (
    <div className='flex justify-center items-center my-4 '>
      <form onSubmit={handleSubmit} className='formStyle w-[500px]'>
        <div className=' w-full h-auto'>
            <Image src="/images/sadhak.jpg" alt='practice' width={450} height={275}/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <label>Class Name:</label>
          <input type='text' className='inputBox' name='prcName' value={data.prcName} onChange={handleChange} placeholder='Enter class name'/>
        </div>
        <div className='grid grid-cols-3 gap-1 w-full'>
            <div className='flex flex-col gap-2 w-full'>
                <label>Starts At:</label>
                <input type='time' className='inputBox' name='prcStartsAt' value={data.prcStartsAt} onChange={handleChange}/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Ends At:</label>
                <input type='time' className='inputBox' name='prcEndsAt' value={data.prcEndsAt} onChange={handleChange}/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Language:</label>
                <select className='inputBox h-[46px]' name='prcLang' value={data.prcLang} onChange={handleChange}>
                  <option>--- Select ---</option>
                  <option  value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
            </div>
        </div>
        <div className='flex flex-col gap-2 w-full mb-2'>
          <label>Practice Days:</label>
          <div className='grid grid-cols-7 gap-1 w-full'>
          {
            practiceDays.map((day, index) => (
              <div key={index} className='flex items-center gap-2 w-full'>
                <input
                  type='checkbox'
                  name='prcDays'
                  value={day}
                  // checked={data.prcDays.includes(day)}
                  onChange={(e:any) => handleCheckboxChange(e, day)}
                />
                <label>{day}</label>
              </div>
            ))
          }
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>WhatsApp Group Link:</label>
            <input type='text' className='inputBox' name='prcWhatLink' value={data.prcWhatLink} onChange={handleChange}/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>Meeting Link:</label>
            <input type='text' className='inputBox' name='prcLink' value={data.prcLink} onChange={handleChange}/>
        </div>
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full mt-4">
            <button type="submit" className="btnLeft w-full">Save</button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/course-practice")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default AddNewPractice;
