"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import toast from "react-hot-toast";
import { format } from "date-fns";


interface IDocParams {
  params:Promise <{
    DocId?: string
  }>
}

interface EditPanCardProps  {
    _id?: string;
    sdkDocOwnr: string;
    sdkUpldDate: Date;
    sdkDocRel: string;
    sdkPan: string;
    sdkPanNbr: string;
    usrId?: string;
  };

const EditPanCard: React.FC <IDocParams> = ({params}) => {

  const router = useRouter();
  const {DocId} = use(params);
  const [data, setData] = useState<EditPanCardProps>({sdkDocOwnr:'', sdkUpldDate:new Date(), sdkDocRel:'', sdkPan:'', sdkPanNbr:'', usrId:''});
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchPanData = async () => {
      try {
          const res = await fetch(`/api/documents/${DocId}/view-doc`);
          const data = await res.json();
          setData(data.docById);
      } catch (error) {
          console.error("Error fetching panData: ", error);
      } finally {
          setIsLoading(false);
      }
    }
  fetchPanData();
  },[]);

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
          const response = await fetch(`${BASE_API_URL}/api/documents/${DocId}/edit-doc`, {
            method: 'PUT',
            body: JSON.stringify({
                sdkDocOwnr: data.sdkDocOwnr, 
                sdkUpldDate: new Date(), 
                sdkDocRel: data.sdkDocRel, 
                sdkPan: data.sdkPan, 
                sdkPanNbr: data.sdkPanNbr,
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
          toast.error('Error updating pan.');
      } 
    };  
  
    if(isLoading){
      return<div>
        <Loading/>
      </div>
    }
    
  return (
    <div className="flex items-center justify-center my-10">
      <form className="formStyle w-[450px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Doc Owner:</label>
          <input className='inputBox' name="sdkDocOwnr" value={data.sdkDocOwnr}  onChange={handleChange}/>
        </div> 
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Relation:</label>
            <input className='inputBox' name="sdkDocRel" value={data.sdkDocRel}  onChange={handleChange}/>
        </div> 
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Upload Pan:</label>
          <div className="flex gap-1">
            <input type='file' className='inputBox w-full' name="sdkPan" value={data.sdkPan} onChange={handleChange}/>
            <button type='button' className='btnRight'>Upload</button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Pan Number:</label>
          <input type='text' className='inputBox'name="sdkPanNbr" value={data.sdkPanNbr} onChange={handleChange}/>
        </div>
        <div className="flex gap-1 w-full mt-3">
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
export default EditPanCard;

