"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import Loading from "@/app/account/Loading";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";

interface IEveParams {
    params: Promise<{
        EveId?: string;
    }>;
}

interface EventCategoryListProps {
    _id:string;
    eveCatName:string;
  }

interface EditEventProps{
  eveName:string,
  eveCatId:string,
  eveAud:string,
  eveType:string,
  eveMode:string,
  eveDon:number,
  eveShort:string,
  eveStartAt:string,
  eveEndAt:string,
  eveDesc: string,
  eveDate:string,
  eveLink:string,
  eveLoc:string,
  eveSpeak:string,
  evePer:string,
  eveCont:string,
  eveImg?:string,
  usrId?:string
}

const ViewEvent: React.FC<IEveParams> = ({params}) => {

  const router = useRouter();
  const {EveId} = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [catList, setCatList] = useState<EventCategoryListProps[] | null>([]);
  const [data, setData] = useState<EditEventProps>({ eveName: "", eveCatId: "", eveAud: "", eveType: "", eveMode: "", eveDon:0, eveShort: "", eveStartAt: "", eveEndAt: "", eveDesc: "", eveDate: "", eveLink: "", eveLoc: "", eveSpeak: "", evePer: "", eveCont: "", eveImg: "", usrId: ""});
  

  useEffect(() => { 
  async function fetchEventById() { 
    try 
      { 
        const res = await fetch(`${BASE_API_URL}/api/events/${EveId}/view-event`, {cache: "no-store"}); 
        const eventData = await res.json(); 
        setData(eventData.eveById);      
      } catch (error) { 
          console.error("Error fetching eventData:", error); 
      } finally { 
          setIsLoading(false); 
        } 
      } fetchEventById(); 
    }, []);
  
  useEffect(() => { async function fetchEventCatData() { 
    try 
      { 
        const res = await fetch(`${BASE_API_URL}/api/event-category`, {cache: "no-store"}); 
        const catData = await res.json(); 
        setCatList(catData.eveCatList);        
      } catch (error) { 
          console.error("Error fetching catData:", error); 
      } finally { 
          setIsLoading(false); 
        } 
      } fetchEventCatData(); 
    }, []);

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value
    setData((prev)=>{
      return {
        ...prev, [name]:value
      }
    });
  };

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }

  return (
    <div>
      <form className="formStyle w-full">
        <div className="grid grid-cols-2 gap-6">
            <div className="w-full h-[250px]">
                <Image src='/images/sadhak.jpg' alt='sadhak' width={600} height={250} />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Event Title:</label>
                    <input type='text' className='inputBox' placeholder="Enter event title" name="eveName" value={data.eveName} onChange={handleChange} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Category:</label>
                    <select className='inputBox' name="eveCatId" value={data.eveCatId} onChange={handleChange} disabled>
                        <option className="text-center">--- Select Category ---</option>
                        {
                            catList?.map((item)=>{
                                return(
                                    <option key={item._id} value={item._id}>{item.eveCatName}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Short Intro:</label>
                    <textarea rows={3} className='inputBox' name="eveShort" value={data.eveShort} onChange={handleChange} readOnly/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Event Type:</label>
                    <input className='inputBox' name="eveType" value={data.eveType} onChange={handleChange} readOnly/>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Mode Of Event:</label>
                <input className='inputBox' name="eveMode" value={data.eveMode} onChange={handleChange} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Donation:</label>
                <input type='number' className='inputBox' name="eveDon" value={data.eveDon} onChange={handleChange} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audiance:</label>
                <input className='inputBox' name="eveAud" value={data.eveAud} onChange={handleChange} readOnly/>
            </div>
        </div>
        {data.eveMode === "Online" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Meeting Link:</label>
            <input type='text' className='inputBox' name="eveLink" value={data.eveLink} onChange={handleChange} readOnly />
        </div>
        )}
        {data.eveMode === "Offline" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="eveLoc" value={data.eveLoc} onChange={handleChange} readOnly />
        </div>
        )}
        {data.eveMode === "Offline with live broadcast" && (
        <div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Meeting Link:</label>
                <input type='text' className='inputBox' name="eveLink" value={data.eveLink} onChange={handleChange} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Location:</label>
                <textarea rows={3} className='inputBox' name="eveLoc" value={data.eveLoc} onChange={handleChange} readOnly/>
            </div>
        </div>
        )}
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Speaker Name:</label>
                <input type='text' className='inputBox' name="eveSpeak" value={data.eveSpeak} onChange={handleChange} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Contact Person:</label>
                <input type='text' className='inputBox' name="evePer" value={data.evePer} onChange={handleChange} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Contact Number:</label>
                <input type='number' className='inputBox' name="eveCont" value={data.eveCont} onChange={handleChange} readOnly/>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Date</label>
                <input type='date' className='inputBox' name="eveDate" value={data.eveDate} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Starts At:</label>
                <input type='time' className='inputBox' name="eveStartAt" value={data.eveStartAt} onChange={handleChange} readOnly/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Ends At:</label>
                <input type='time' className='inputBox' name="eveEndAt" value={data.eveEndAt} onChange={handleChange} readOnly/>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Description:</label>
            <textarea rows={6} className='inputBox' name="eveDesc" value={data.eveDesc} onChange={handleChange} readOnly/>
        </div>
        <div className="flex gap-1 w-full">
            <button type="button" className="btnLeft" onClick={() => router.push("/account/event-list")}>Back</button>
        </div>
      </form>
    </div>
  );
};
export default ViewEvent;
