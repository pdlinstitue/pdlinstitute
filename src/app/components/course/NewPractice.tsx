"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const NewPractice = () => {

  const router = useRouter();
  const practiceDays : string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  return (
    <div className='flex justify-center items-center my-4 '>
      <form className='flex flex-col gap-2 items-center p-6 w-[500px] h-auto rounded-md border-[1.5px] border-orange-500'>
        <div className=' w-full h-auto'>
            <Image src="/images/sadhak.jpg" alt='practice' width={450} height={275}/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <label>Practice Title:</label>
          <input type='text' className='inputBox ' placeholder='Enter Practice Title'/>
        </div>
        <div className='grid grid-cols-3 gap-1 w-full'>
            <div className='flex flex-col gap-2 w-full'>
                <label>Starts At:</label>
                <input type='time' className='inputBox '/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Ends At:</label>
                <input type='time' className='inputBox '/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Language:</label>
                <select className='inputBox h-[46px]'>
                  <option>--- Select ---</option>
                  <option>Hindi</option>
                  <option>English</option>
                </select>
            </div>
        </div>
        <div className='flex flex-col gap-2 w-full mb-2'>
          <label>Practice Days:</label>
          <div className='grid grid-cols-7 gap-1 w-full'>
          {
            practiceDays.map((day, index) => (
              <div key={index} className='flex items-center gap-2 w-full'>                                          
                  <input type='checkbox'/>
                  <label>{day}</label>
              </div>
            ))
          }
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>WhatsApp Group Link:</label>
            <input type='text' className='inputBox '/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>Meeting Link:</label>
            <input type='text' className='inputBox '/>
        </div>
        <div className="flex gap-1 w-full mt-4">
            <button type="submit" className="btnLeft w-full">Save</button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/practice")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default NewPractice;
