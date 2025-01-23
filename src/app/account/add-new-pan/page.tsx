"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";


interface AddNewPanProps  {
    sdkDocType: string;
    sdkDocOwnr: string;
    sdkUpldDate: Date;
    sdkDocRel: string;
    sdkPan: string;
    sdkPanNbr: string;
    usrId?: string;
  };

const AddNewPan: React.FC = () => {

  const router = useRouter();
  const [data, setData] = useState<AddNewPanProps>({sdkDocType:'', sdkDocOwnr:'', sdkUpldDate:new Date(), sdkDocRel:'', sdkPan:'', sdkPanNbr:'', usrId:''});
   
  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) =>{
        return {
            ...prev, [name]: value
        }
    });     
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();      
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/documents`, {
            method: 'POST',
            body: JSON.stringify({
                sdkDocType: 'Pan',
                sdkDocOwnr: data.sdkDocOwnr, 
                sdkUpldDate: new Date(), 
                sdkPanNbr: data.sdkPanNbr,
                sdkDocRel: data.sdkDocRel, 
                sdkPan: data.sdkPan,   
                // usrId: data.usrId
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/doc-list/pan-card');
          }
      } catch (error) {
          toast.error('Error uploading document.');
      } 
    }; 
    
  return (
    <div className="flex justify-center items-center my-8">
      <form className="formStyle w-[600px]" onSubmit={handleSubmit}>
        <div className="grid grid-rows-4 gap-2">
          <div className="flex flex-col gap-2">
              <label className='text-lg'>Pan:</label>
              <input type='text' className='inputBox'name="sdkPanNbr" value={data.sdkPanNbr} onChange={handleChange} placeholder="Enter pan number"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className='text-lg'>Owner of Pan:</label>
            <input className='inputBox' name="sdkDocOwnr" value={data.sdkDocOwnr}  onChange={handleChange}/>
          </div> 
          <div className="flex flex-col gap-2">
              <label className='text-lg'>Relation:</label>
              <input className='inputBox' name="sdkDocRel" value={data.sdkDocRel}  onChange={handleChange}/>
          </div>
          <div className="flex flex-col gap-2">
              <label className='text-lg'>Pan Image:</label>
              <div className="flex gap-1">
                  <input type='file' className='inputBox w-full' name="sdkPan" value={data.sdkPan} onChange={handleChange} required/>
                  <button type='button' className='btnRight'>Upload</button>
              </div>
          </div>                        
        </div>
        <div className="flex gap-2 w-full mt-3">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/doc-list/pan-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewPan;

