"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import { format } from "date-fns";

interface IBthParams {
    params: Promise<{
        BthId?: string;
    }>;
}

interface ViewBatchProps  {
    _id?:string,
    bthName:string, 
    bthTime:string, 
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
    usrId?:string
}

const ViewBatch: React.FC<IBthParams> = ({params}) => {

  const router = useRouter();
  const {BthId} = use(params);
  const [data, setData] = useState<ViewBatchProps>({bthName:'', bthTime:'', bthStart: new Date(), bthEnd: new Date(), corId:'', bthVtr:'', bthWhatGrp:'', bthTeleGrp:'', bthLang:'', bthMode:'', bthLink:'', bthLoc:'', bthBank:'', bthQr:''});
  const [isLoading, setIsLoading] = useState(true);
  const [coList, setCoList] = useState<{ _id: string; coNick: string; coName: string }[] | null>([]); 
  
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
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }  finally {
        setIsLoading(false);
      }
    }
    fetchBatchById();
    }, []);
  
    if(isLoading){
      return<div>
        <Loading/>
      </div>
    }
    
  return (
    <div>
      <div className="formStyle w-full">
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Batch Title:</label>
                    <input type="text" className="inputBox" name="bthName" defaultValue={data.bthName}  readOnly />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Batch Shift:</label>
                    <select className='inputBox' name="bthTime" value={data.bthTime} disabled>
                        <option className="text-center">--- Select Shift ---</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Course:</label>
                    <select className='inputBox' name="corId" value={data.corId} disabled>
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
                    <select className='inputBox' name="bthVtr" value={data.bthVtr} disabled>
                        <option className="text-center">--- Assign Volunteer ---</option>
                        <option  value="Basic Education - 1">Free</option>
                        <option  value="Basic Education - 2">Donation</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-2">           
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Start date:</label>
                    <input type='date' className='inputBox'name="bthStart" value={format(data.bthStart, 'yyyy-MM-dd')} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>End date</label>
                    <input type='date' className='inputBox' name="bthEnd" value={format(data.bthEnd, 'yyyy-MM-dd')} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>WhatsApp group:</label>
                    <input type='text' className='inputBox' name="bthWhatGrp" value={data.bthWhatGrp} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Telegram group:</label>
                    <input type='text' className='inputBox' name="bthTeleGrp" value={data.bthTeleGrp} readOnly/>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Mode Of Batch:</label>
                <select className='inputBox'  value={data.bthMode} disabled>
                    <option className="text-center">--- Select Mode ---</option>
                    <option value="Online">Online</option>
                    <option value="Offline without accommodation">Offline without accommodation</option>
                    <option value="Offline with accommodation">Offline with accommodation</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className='text-lg'>Language:</label>
              <select className='inputBox' name="bthLang" value={data.bthLang} disabled>
                  <option className="text-center">--- Select Language ---</option>
                  <option value="ENG">English</option>
                  <option value="HIN">Hindi</option>
              </select>
            </div>
        </div>
        {data.bthMode === "Online" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Meeting Link:</label>
            <input type='text' className='inputBox' name="bthLink" value={data.bthLink} readOnly/>
        </div>
        )}
        {data.bthMode === "Offline with accommodation" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="bthLoc" value={data.bthLoc} readOnly/>
        </div>
        )}
        {data.bthMode === "Offline without accommodation" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="bthLoc" value={data.bthLoc} readOnly/>
        </div>
        )}
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label>Bank Details</label>
                <textarea rows={3} className='inputBox' name="bthBank" value={data.bthBank} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label>QR Code</label>
                <textarea rows={3} className='inputBox' name="bthQr" value={data.bthQr} readOnly/>
            </div>
        </div>
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
      </div>
    </div>
  );
};
export default ViewBatch;

