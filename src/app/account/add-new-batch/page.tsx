"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { format } from "date-fns";

const AddNewBatch: React.FC = () => {

  const router = useRouter();
  const [data, setData] = useState({bthName:'', bthTime:'', bthStart:'', bthEnd:'', corId:'', bthVtr:'', bthWhatGrp:'', bthTeleGrp:'', bthLang:'', bthMode:'', bthLink:'', bthLoc:'', bthBank:'', bthQr:''});
  const [isLoading, setIsLoading] = useState(true);
  const [batchMode, setBatchMode] = React.useState<string>("");

  const handleBatchMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === "Online") {
      setBatchMode("Online");
    } else if(e.target.value === "Offline without accommodation") {
      setBatchMode("Offline without accommodation");
    } else if(e.target.value === "Offline with accommodation") {
      setBatchMode("Offline with accommodation");
    }
  }

  const [errorMessage, setErrorMessage] = useState('');
  const [coList, setCoList] = useState<{ _id: string; coNick: string; coName: string }[] | null>([]); 
  const [batchTitle, setBatchTitle] = useState(''); 

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) =>{
        return {
            ...prev, [name]: value
        }
    });     
  }
  
  useEffect(()=>{
    const updateBatchTitle = () => { 
      if (data.bthLang && data.corId && data.bthStart && data.bthTime) {
        const cor = coList?.filter((item:any)=>item._id === data.corId); 
        if (cor && cor.length > 0) {
          const bthStartDate = new Date(data.bthStart); const formattedBthStart = format(bthStartDate, 'MMM do, yyyy'); 
          setBatchTitle(`${cor[0]?.coNick}-${data.bthLang}-${data.bthTime}-${formattedBthStart}`);
        } else {
          setBatchTitle('');
        }
      } 
      else{
        setBatchTitle('');
      }
    };

    updateBatchTitle();
  },[data.corId,data.bthStart,data.bthTime,data.bthLang])
  

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
        
    if (!data.bthTime.trim()) {
        errMsg.push('Please select shift.');    
    }
    
    if (!data.corId.trim()) {
        errMsg.push('Please select course.');    
    }

    if (!batchMode.trim()) {
        errMsg.push('Please select mode.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
      
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/batches`, {
            method: 'POST',
            body: JSON.stringify({
              bthName:batchTitle, 
              bthTime:data.bthTime, 
              bthStart:data.bthStart, 
              bthEnd:data.bthEnd, 
              corId:data.corId, 
              bthVtr:data.bthVtr, 
              bthWhatGrp:data.bthWhatGrp, 
              bthTeleGrp:data.bthTeleGrp, 
              bthLang:data.bthLang, 
              bthMode:batchMode, 
              bthLink:data.bthLink, 
              bthLoc:data.bthLink, 
              bthBank:data.bthBank, 
              bthQr:data.bthQr
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/batch-list');
          }
      } catch (error) {
          toast.error('Error creating course.');
      } 
    };  
  
    if(isLoading){
      return<div>
        <Loading/>
      </div>
    }
    
  return (
    <div>
      <form className="flex flex-col gap-4 h-auto border-[1.5px] border-orange-500 p-6 rounded-md" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Batch Title:</label>
                    <input type="text" className="inputBox" name="bthName" value={batchTitle}  readOnly />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Batch Shift:</label>
                    <select className='inputBox' name="bthTime" value={data.bthTime} onChange={handleChange}>
                        <option className="text-center">--- Select Shift ---</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Course:</label>
                    <select className='inputBox' name="corId" value={data.corId} onChange={handleChange}>
                        <option className="text-center">--- Select Course ---</option>
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
                    <label className='text-lg'>Volunteer:</label>
                    <select className='inputBox' name="bthVtr" value={data.bthVtr} onChange={handleChange}>
                        <option className="text-center">--- Assign Volunteer ---</option>
                        <option  value="Basic Education - 1">Free</option>
                        <option  value="Basic Education - 2">Donation</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-2">           
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Start Date:</label>
                    <input type='date' className='inputBox'name="bthStart" value={data.bthStart} onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>End Date</label>
                    <input type='date' className='inputBox' name="bthEnd" value={data.bthEnd} onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>WhatsApp group:</label>
                    <input type='text' className='inputBox' name="bthWhatGrp" value={data.bthWhatGrp} onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Telegram group:</label>
                    <input type='text' className='inputBox' name="bthTeleGrp" value={data.bthTeleGrp} onChange={handleChange}/>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Mode Of Batch:</label>
                <select className='inputBox'  value={batchMode} onChange={handleBatchMode}>
                    <option className="text-center">--- Select Mode ---</option>
                    <option value="Online">Online</option>
                    <option value="Offline without accommodation">Offline without accommodation</option>
                    <option value="Offline with accommodation">Offline with accommodation</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className='text-lg'>Language:</label>
              <select className='inputBox' name="bthLang" value={data.bthLang} onChange={handleChange}>
                  <option className="text-center">--- Select Language ---</option>
                  <option value="ENG">English</option>
                  <option value="HIN">Hindi</option>
              </select>
            </div>
        </div>
        {batchMode === "Online" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Meeting Link:</label>
            <input type='text' className='inputBox' name="bthLink" value={data.bthLink} onChange={handleChange}/>
        </div>
        )}
        {batchMode === "Offline with accommodation" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="bthLoc" value={data.bthLoc} onChange={handleChange}/>
        </div>
        )}
        {batchMode === "Offline without accommodation" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="bthLoc" value={data.bthLoc} onChange={handleChange}/>
        </div>
        )}
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label>Bank Details</label>
                <textarea rows={3} className='inputBox' name="bthBank" value={data.bthBank} onChange={handleChange}/>
            </div>
            <div className="flex flex-col gap-2">
                <label>QR Code</label>
                <textarea rows={3} className='inputBox' name="bthQr" value={data.bthQr} onChange={handleChange}/>
            </div>
        </div>
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/batch-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewBatch;

