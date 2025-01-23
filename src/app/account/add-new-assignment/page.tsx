"use client";
import Loading from '../Loading';
import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';

interface AddNewAssignmentProps {
  asnName: string, 
  asnType: string, 
  asnLink: string, 
  asnFile: string,
  asnOrder: string, 
  corId: string, 
  usrId?: string
}

const AddNewAssignment : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [assignBox, setAssignBox] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [coList, setCoList] = useState<{ _id: string; coNick: string; coName: string }[] | null>([])
  const [data, setData] = useState<AddNewAssignmentProps>({asnName:'', corId:'', asnType:'', asnLink:'', asnFile:'', asnOrder:'', usrId:''});

  const handleAssignmentType  = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === "Audio") {
        setAssignBox("Audio");
    } else if(e.target.value === "Video") {
        setAssignBox("Video");
    } else if(e.target.value === "File/Image") {
        setAssignBox("File/Image");
    }
  }

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev)=>{
      return {
        ...prev, [name]:value
      }
    });
  }

  useEffect(() => {
  async function fetchCourseData() {
    try {
      const res = await fetch(`${BASE_API_URL}/api/courses`, { cache: "no-store" });
      const coData = await res.json();
      setCoList(coData.coList);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }  finally {
      setIsLoading(false);
    }
  }
  fetchCourseData();
  }, []);

  const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error
    let errMsg: string[] = [];
        
    if (!data.asnName.trim()) {
        errMsg.push('Please enter assignment name.');    
    }
    
    if (!data.corId.trim()) {
        errMsg.push('Please select course.');    
    }

    if (!assignBox.trim()) {
        errMsg.push('Please select type.');    
    }

    if (!data.asnOrder.trim()) {
      errMsg.push('Please select order.');    
  }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
      
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/assignments`, {
            method: 'POST',
            body: JSON.stringify({
              asnName:data.asnName, 
              asnType:assignBox, 
              corId:data.corId, 
              asnLink:data.asnLink, 
              asnFile:data.asnFile, 
              asnOrder:data.asnOrder, 
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/assignment-sent');
          }
      } catch (error) {
          toast.error('Error creating assignment.');
      } 
    };  
  
    if(isLoading){
      return<div>
        <Loading/>
      </div>
    }

  return (
    <div className='flex items-center justify-center my-8'>
      <form onSubmit={handleSubmit} className="flex flex-col w-[450px] gap-2 h-auto border-[1.5px] border-orange-500 p-9 shadow-xl rounded-md">
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Assignment Title:</label>
            <input type='text' name='asnName' value={data.asnName} onChange={handleChange} className='inputBox h-[48px]'/>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Course:</label>
            <select name='corId' value={data.corId} onChange={handleChange} className='inputBox'>
                <option className='text-center'>--- Select Course ---</option>
                {
                  coList?.map((item:any)=>{
                    return (
                      <option key={item._id} value={item._id}>{item.coName}</option>
                    )
                  })
                }
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Assignment Order:</label>
            <select className='inputBox' name='asnOrder' value={data.asnOrder} onChange={handleChange}>
                <option className='text-center'>--- Select Order ---</option>
                <option value="Pre-Class">Pre-Class</option>
                <option value="Post-Class">Post-Class</option>
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Assignment Type:</label>
            <select className='inputBox' value={assignBox} onChange={handleAssignmentType}>
                <option className='text-center'>--- Select Type ---</option>
                <option value="Audio">Audio</option>
                <option value="Video">Video</option>
                <option value="File/Image">File/Image</option>
            </select>
        </div>
        {
            assignBox === "Audio" && (
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audio/Video Link:</label>
                <input type='text' name='asnLink' value={data.asnLink} onChange={handleChange} className='inputBox'/>
            </div>
            )
        }
        {
            assignBox === "Video" && (
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audio/Video Link:</label>
                <input type='text' name='asnLink' value={data.asnLink} onChange={handleChange} className='inputBox'/>
            </div>
            )
        }
        {
            assignBox === "File/Image" && (
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Upload File:</label>
                <div className='flex gap-1 items-center'>
                    <input type='file' name='asnFile' value={data.asnFile} onChange={handleChange} className='inputBox w-full h-[47px]'/>
                    <button type='button' className='btnRight'>Upload</button>
                </div>
            </div> 
            )
        }
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}  
        <div className="flex gap-1 w-full mt-4">
            <button type="submit" className="btnLeft w-full">Save</button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/assignment-sent")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default AddNewAssignment;
