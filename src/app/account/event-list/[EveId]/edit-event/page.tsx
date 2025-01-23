"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import Loading from "@/app/account/Loading";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";


interface EventCategoryListProps {
  _id:string;
  eveCatName:string;
}

interface IEveParams {
    params: Promise<{
        EveId?: string;
    }>;
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

const EditEvent: React.FC<IEveParams> = ({params}) => {

  const router = useRouter();
  const {EveId} = use(params);
  const [errorMessage, setErrorMessage] = useState('');
  const [catList, setCatList] = useState<EventCategoryListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EditEventProps>({ eveName: "", eveCatId: "", eveAud: "", eveType: "", eveMode: "", eveDon:0, eveShort: "", eveStartAt: "", eveEndAt: "", eveDesc: "", eveDate: "", eveLink: "", eveLoc: "", eveSpeak: "", evePer: "", eveCont: "", eveImg: "", usrId: ""});
  
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

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev)=>{
      return {
        ...prev, [name]:value
      }
    });
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error
    let errMsg: string[] = [];
        
    if (!data.eveName.trim()) {
        errMsg.push('Please enter event name.');    
    }
    
    if (!data.eveCatId.trim()) {
        errMsg.push('Please select category.');    
    }

    if (!data.eveType.trim()) {
        errMsg.push('Please select event type.');    
    }

    if (!data.eveMode.trim()) {
        errMsg.push('Please select mode.');    
    }

    if (!data.eveAud.trim()) {
      errMsg.push('Please select audiance.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
      
    try {
          const response = await fetch(`${BASE_API_URL}/api/events/${EveId}/edit-event`, {
            method: 'PUT',
            body: JSON.stringify({
              eveName: data.eveName,
              eveCatId: data.eveCatId,
              eveAud: data.eveAud,
              eveType: data.eveType,
              eveMode: data.eveMode,
              eveDon: data.eveDon,
              eveShort: data.eveShort,
              eveStartAt: data.eveStartAt,
              eveEndAt: data.eveEndAt,
              eveDesc: data.eveDesc,
              eveDate: data.eveDate,
              eveLink: data.eveLink,
              eveLoc: data.eveLoc,
              eveSpeak: data.eveSpeak,
              evePer: data.evePer,
              eveCont: data.eveCont,
              eveImg: data.eveImg,
              // usrId: data.usrId,
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/event-list');
          }
      } catch (error) {
          toast.error('Error creating event.');
      } 
    };

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="formStyle w-full">
        <div className="grid grid-cols-2 gap-6">
            <div className="w-full h-[250px]">
                <Image src='/images/sadhak.jpg' alt='sadhak' width={600} height={250} />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Event Title:</label>
                    <input type='text' className='inputBox' placeholder="Enter event title" name="eveName" value={data.eveName} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Category:</label>
                    <select className='inputBox' name="eveCatId" value={data.eveCatId} onChange={handleChange}>
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
                    <textarea rows={3} className='inputBox' name="eveShort" value={data.eveShort} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Event Type:</label>
                    <select className='inputBox' name="eveType" value={data.eveType} onChange={handleChange}>
                        <option className="text-center">--- Select Type ---</option>
                        <option value="Free">Free</option>
                        <option value="Donation">Donation</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Mode Of Event:</label>
                <select className='inputBox' name="eveMode" value={data.eveMode} onChange={handleChange}>
                    <option className="text-center">--- Select Mode ---</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Offline with live broadcast">Offline with live broadcast</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Donation:</label>
                <input type='number' className='inputBox' name="eveDon" value={data.eveDon} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audiance:</label>
                <select className='inputBox' name="eveAud" value={data.eveAud} onChange={handleChange}>
                    <option className="text-center">--- Select Audience ---</option>
                    <option value="Public">Public</option>
                    <option value="Sadhak">Sadhak</option>
                </select>
            </div>
        </div>
        {data.eveMode === "Online" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Meeting Link:</label>
            <input type='text' className='inputBox' name="eveLink" value={data.eveLink} onChange={handleChange} />
        </div>
        )}
        {data.eveMode === "Offline" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox' name="eveLoc" value={data.eveLoc} onChange={handleChange} />
        </div>
        )}
        {data.eveMode === "Offline with live broadcast" && (
        <div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Meeting Link:</label>
                <input type='text' className='inputBox' name="eveLink" value={data.eveLink} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Location:</label>
                <textarea rows={3} className='inputBox' name="eveLoc" value={data.eveLoc} onChange={handleChange} />
            </div>
        </div>
        )}
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Speaker Name:</label>
                <input type='text' className='inputBox' name="eveSpeak" value={data.eveSpeak} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Contact Person:</label>
                <input type='text' className='inputBox' name="evePer" value={data.evePer} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Contact Number:</label>
                <input type='number' className='inputBox' name="eveCont" value={data.eveCont} onChange={handleChange} />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Date</label>
                <input type='date' className='inputBox' name="eveDate" value={data.eveDate} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Starts At:</label>
                <input type='time' className='inputBox' name="eveStartAt" value={data.eveStartAt} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Ends At:</label>
                <input type='time' className='inputBox' name="eveEndAt" value={data.eveEndAt} onChange={handleChange} />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Description:</label>
            <textarea rows={6} className='inputBox' name="eveDesc" value={data.eveDesc} onChange={handleChange} />
        </div>
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full">
            <button type="submit" className="btnLeft w-full">Save</button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/event-list")}>Back</button>
        </div>
      </form>
    </div>
  );
};
export default EditEvent;
