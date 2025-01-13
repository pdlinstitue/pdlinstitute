"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const NewAssignment = () => {

  const router = useRouter();

  return (
    <div>
      <form className="flex flex-col gap-2 h-auto border-[1.5px] border-orange-500 p-6 rounded-md">
        <div className='grid grid-cols-2 gap-1'>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Assignment Title:</label>
                <input type='text' className='inputBox h-[48px]'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Upload File:</label>
                <div className='flex gap-1 items-center'>
                    <input type='file' className='inputBox w-full'/>
                    <button type='button' className='btnRight'>Upload</button>
                </div>
            </div> 
        </div>
        <div className='grid grid-cols-2 gap-1'>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Video Link:</label>
                <input type='text' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audio Link:</label>
                <input type='text' className='inputBox'/>
            </div>
        </div>
        <div className='grid grid-cols-2 gap-1'>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Course:</label>
                <select className='inputBox'>
                    <option className='text-center'>--- Select Course ---</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Assignment Type:</label>
                <select className='inputBox'>
                    <option className='text-center'>--- Select Type ---</option>
                    <option value="Audio">Audio</option>
                    <option value="Audio">Video</option>
                    <option value="Audio">File/Image</option>
                </select>
            </div>
        </div>
        <div className='grid grid-cols-2 gap-1'>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Order:</label>
                <select className='inputBox'>
                    <option className='text-center'>--- Select Order ---</option>
                    <option value="Pre-Class">Pre-Class</option>
                    <option value="Post-Class">Post-Class</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Assignment Day:</label>
                <select className='inputBox'>
                    <option className='text-center'>--- Select Day ---</option>
                    <option value="Audio">DAY-1</option>
                    <option value="Video">DAY-2</option>
                    <option value="File/Image">DAY-3</option>
                </select>
            </div>
        </div>
        <div className="flex gap-1 w-full mt-4">
            <button type="submit" className="btnLeft w-full">Save</button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/assignment-sent")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default NewAssignment;
