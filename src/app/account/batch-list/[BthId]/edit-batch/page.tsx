"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface IBthParams {
  params: Promise<{
      BthId?: string;
  }>;
}

interface EditBatchProps  {
    _id?:string,
    bthName:string, 
    bthShift:string, 
    bthStart:Date, 
    bthEnd:Date, 
    corId:string, 
    bthVtr:string, 
    bthWhatGrp:string, 
    bthTeleGrp:string, 
    bthLang:string, 
    bthMode:string, 
    bthLink:string, 
    bthLoc:string, 
    bthBank:string, 
    bthQr:string,
    updatedBy?:string
}

const EditBatch: React.FC<IBthParams> = ({params}) => {

  const router = useRouter();
  const {BthId} = use(params);
  const [data, setData] = useState({bthName:'', bthShift:'', bthStart:new Date(), bthEnd:new Date(), corId:'', bthVtr:'', bthWhatGrp:'', bthTeleGrp:'', bthLang:'', bthMode:'', bthLink:'', bthLoc:'', bthBank:'', bthQr:'', updatedBy:''});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [coList, setCoList] = useState<{ _id: string; coNick: string; coName: string }[] | null>([]); 
  const [batchTitle, setBatchTitle] = useState(''); 

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
  
  useEffect(()=>{
  const updateBatchTitle = () => { 
    if (data.bthLang && data.corId && data.bthStart && data.bthShift) {
    const cor = coList?.filter((item:any)=>item._id === data.corId); 
      if (cor && cor.length > 0) {
          const bthStartDate = new Date(data.bthStart); const formattedBthStart = format(bthStartDate, 'MMM do, yyyy'); 
          setBatchTitle(`${cor[0]?.coNick}-${data.bthLang}-${data.bthShift}-${formattedBthStart}`);
      } else {
          setBatchTitle('');
      }
    } 
    else{
      setBatchTitle('');
    }
  };
  updateBatchTitle();
  },[data.corId,data.bthStart,data.bthShift,data.bthLang])
  

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

  useEffect(() => {
  async function fetchBatchById() {
  try 
    {
      const res = await fetch(`${BASE_API_URL}/api/batches/${BthId}/view-batch`, { cache: "no-store" });
      const batchData = await res.json();
      setData(batchData.bthById);
      setBatchTitle(batchData.bthById.bthName)
    } catch (error) {
        console.error("Error fetching batch data:", error);
    } finally {
      setIsLoading(false);
    }
  }
  fetchBatchById();
  }, []);

  const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error
         
    if (!data.bthShift.trim()) {
        setErrorMessage('Please select shift.');    
    } else if (!data.corId.trim()) {
        setErrorMessage('Please select course.');    
    } else if (!data.bthMode.trim()) {
        setErrorMessage('Please select mode.');    
    } else if (!data.bthLang.trim()) {
        setErrorMessage('Please select language.');    
    } else if (data.bthMode === "Online" && !data.bthLink.trim()) {
        setErrorMessage('Please provide meeting link.');
    } else if (data.bthMode !== "Online" && !data.bthLoc.trim()) {
        setErrorMessage('Please provide location details.');
    } else {
      try 
      {
        const response = await fetch(`${BASE_API_URL}/api/batches/${BthId}/edit-batch`, {
          method: 'PUT',
          body: JSON.stringify({
            bthName:batchTitle, 
            bthShift:data.bthShift, 
            bthStart:data.bthStart, 
            bthEnd:data.bthEnd, 
            corId:data.corId, 
            bthVtr:data.bthVtr, 
            bthWhatGrp:data.bthWhatGrp, 
            bthTeleGrp:data.bthTeleGrp, 
            bthLang:data.bthLang, 
            bthMode:data.bthMode, 
            bthLink:data.bthLink, 
            bthLoc:data.bthLoc, 
            bthBank:data.bthBank, 
            bthQr:data.bthQr,
            updatedBy: loggedInUser.result._id
          }),
        });
    
        const post = await response.json();
    
        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/batch-list');
        }
      } catch (error) {
          toast.error('Error creating batch.');
      } 
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
                    <select className='inputBox' name="bthShift" value={data.bthShift} onChange={handleChange}>
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
                    <input type='date' className='inputBox'name="bthStart" value={format(data.bthStart, 'yyyy-MM-dd')} onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>End Date</label>
                    <input type='date' className='inputBox' name="bthEnd" value={format(data.bthEnd, 'yyyy-MM-dd')} onChange={handleChange}/>
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
              <select className='inputBox' name="bthMode" value={data.bthMode} onChange={handleChange}>
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
        {data.bthMode === "Online" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Meeting Link:</label>
            <input type='text' className='inputBox' name="bthLink" value={data.bthLink} onChange={handleChange}/>
        </div>
        )}
        {data.bthMode === "Offline with accommodation" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="bthLoc" value={data.bthLoc} onChange={handleChange}/>
        </div>
        )}
        {data.bthMode === "Offline without accommodation" && (
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
        {errorMessage && <p className="text-sm text-red-600 italic">{errorMessage}</p>}
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
export default EditBatch;

