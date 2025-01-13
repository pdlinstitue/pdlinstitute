"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const NewSadhak : React.FC = () => {

  const router = useRouter();
  return (
    <div>
      <form className='flex flex-col gap-4 h-auto border-[1.5px] border-orange-500 p-6 rounded-md'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='w-full h-[250px]'>
            <Image src='/images/sadhak.jpg' alt='sadhak' width={600} height={250} />
          </div>
          <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-3 gap-2'>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>First Name:</label>
              <input type='text' className='inputBox'/>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>Middle Name:</label>
              <input type='text' className='inputBox'/>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>Last Name:</label>
              <input type='text' className='inputBox'/>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>Father's Name:</label>
              <input type='text' className='inputBox'/>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>Mother's Name:</label>
              <input type='text' className='inputBox'/>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>Birth Date:</label>
              <input type='date' className='inputBox'/>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>Phone:</label>
              <input type='text' className='inputBox'/>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg'>WhatsApp:</label>
              <input type='text' className='inputBox'/>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>About:</label>
            <textarea rows={3} className='inputBox'/>
          </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Gender:</label>
            <select className='inputBox'>
              <option value="female">Female</option>
              <option value="female">Male</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Email:</label>
            <input type='email' className='inputBox'/>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Marital Status:</label>
            <select className='inputBox'>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Spouce Name:</label>
            <input type='text' className='inputBox'/>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Country:</label>
            <select className='inputBox'>
              <option value="india">India</option>
              <option value="usa">USA</option>
              <option value="uk">UK</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>State:</label>
            <select className='inputBox'>
              <option value="india">India</option>
              <option value="usa">USA</option>
              <option value="uk">UK</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>City:</label>
            <select className='inputBox'>
              <option value="india">India</option>
              <option value="usa">USA</option>
              <option value="uk">UK</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Role:</label>
            <select className='inputBox'>
              <option value="Admin">Admin</option>
              <option value="Sadhak">Sadhak</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Permanent Address:</label>
            <textarea rows={3} className='inputBox'/>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Current Address:</label>
            <textarea rows={3} className='inputBox'/>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Profile Image:</label>
            <input type='file' className='inputBox'/>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>ID Card:</label>
            <input type='file' className='inputBox'/>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Any medical issue?:</label>
            <div className='flex gap-2 items-center'>
              <input type='radio' name='mIssues'/> 
              <span>Yes</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type='radio' name='mIssue' defaultChecked/> 
              <span>No</span>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg'>Describe Medical Issues:</label>
            <textarea rows={3} className='inputBox'/>
          </div>
        </div>
        <div className='flex gap-1 w-full'>
            <button type='submit' className='btnLeft w-full'>Save</button>
            <button type='reset' className='btnRight w-full' onClick={()=>router.push('/account/sadhaklist')}>Back</button>
        </div>
      </form>
    </div>
  )
}
export default NewSadhak;
