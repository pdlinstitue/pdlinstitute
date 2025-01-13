"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NewEvent: React.FC = () => {

  const router = useRouter();
  const [eventMode, setEventMode] = React.useState<string>("");

  const handleEventMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === "Online") {
      setEventMode("Online");
    } else if(e.target.value === "Offline") {
      setEventMode("Offline");
    } else if(e.target.value === "Offline with live broadcast") {
      setEventMode("Offline with live broadcast");
    }
  }

  return (
    <div>
      <form className="flex flex-col gap-4 h-auto border-[1.5px] border-orange-500 p-6 rounded-md">
        <div className="grid grid-cols-2 gap-6">
            <div className="w-full h-[250px]">
                <Image src='/images/sadhak.jpg' alt='sadhak' width={600} height={250} />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Event Title:</label>
                    <input type='text' className='inputBox' placeholder="Enter event title"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Category:</label>
                    <select className='inputBox'>
                        <option className="text-center">--- Select Category ---</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Short Intro:</label>
                    <textarea rows={3} className='inputBox'/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Event Type:</label>
                    <select className='inputBox'>
                        <option className="text-center">--- Select Type ---</option>
                        <option  value="Basic Education - 1">Free</option>
                        <option  value="Basic Education - 2">Donation</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Date</label>
                <input type='date' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Event Time:</label>
                <input type='time' className='inputBox'/>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Mode Of Event:</label>
                <select className='inputBox' onChange={handleEventMode}>
                    <option className="text-center">--- Select Mode ---</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Offline with live broadcast">Offline with live broadcast</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Donation:</label>
                <input type='number' className='inputBox'/>
            </div>
        </div>
        {eventMode === "Online" && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Meeting Link:</label>
            <input type='text' className='inputBox'/>
        </div>
        )}
        {eventMode === "Offline"  && (
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Location:</label>
            <textarea rows={3} className='inputBox'/>
        </div>
        )}
        {eventMode === "Offline with live broadcast"  && (
        <div>
          <div className="flex flex-col gap-2">
              <label className='text-lg'>Meeting Link:</label>
              <input type='text' className='inputBox'/>
          </div>
          <div className="flex flex-col gap-2">
              <label className='text-lg'>Location:</label>
              <textarea rows={3} className='inputBox'/>
          </div>
        </div>
        )}
        <div className="grid grid-cols-3 gap-1">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Speaker Name:</label>
                <input type='text' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Contact Person:</label>
                <input type='text' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Contact Number:</label>
                <input type='number' className='inputBox'/>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Description:</label>
            <textarea rows={6} className='inputBox'/>
        </div>
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/eventlist")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewEvent;
