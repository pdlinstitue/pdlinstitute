"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_API_URL } from "@/app/utils/constant";

type CatType = {
    _id:string,
    catName:string
}

interface AddNewCourseProps{
    coName: string, 
    coNick: string,
    coShort:string, 
    prodType:string, 
    coAuth: string,
    coCat: string,
    coElg: string,
    coImg: string,
    coType: string,
    coWhatGrp: string,
    coTeleGrp: string,
    coDesc:string, 
    coDon:number, 
    durDays:number, 
    durHrs:number, 
    usrId: string
}

const AddNewCourse: React.FC = () => {

    const router = useRouter();
    const [cat, setCat] = useState<CatType[]>([]); 
    const [errorMessage, setErrorMessage] = useState('');
    // const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [data, setData] = useState<AddNewCourseProps>({coName:'', coNick:'', coShort:'', coType:'', coAuth:'', coDon:0, coDesc:'', prodType:'Courses', coCat:'', coElg:'', coWhatGrp:'', coTeleGrp:'', durDays:0, durHrs:0, coImg:'', usrId:''})    
    

    useEffect(() =>{
      async function fetchData() {
        try {
            const catdata = await fetch(`${BASE_API_URL}/api/categories` , {cache: "no-store"});
            const catValues = await catdata.json();
            setCat(catValues.catList);
        } catch (error) {
            console.error("Error fetching category data: ", error);
        }
      }
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((prev) =>{
            return {
                ...prev, [name]: value
            }
        }); 
    }

  const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error
    let errMsg: string[] = [];
        
    if (!data.coName.trim()) {
        errMsg.push('Course title is must.');    
    }
    if (!data.coNick.trim()) {
        errMsg.push('Course nick name is must.');    
    }
    
    if (!data.coCat.trim()) {
        errMsg.push('Please select category.');    
    }

    if (!data.coType.trim()) {
        errMsg.push('Please select Type.');    
    }

    if (!data.coElg.trim()) {
        errMsg.push('Please select elegibility.');    
    }

    if (data.durDays <= 1) {
        errMsg.push('Please enter number of days.');    
    }

    if (data.durHrs <= 1) {
        errMsg.push('Please enter number of hours.');    
    }

    if (!data.coShort.trim()) {
        errMsg.push('Please enter course introduction.');    
    } 

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
      
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/courses`, {
            method: 'POST',
            body: JSON.stringify({ 
                coName: data.coName, 
                coNick: data.coNick,
                coShort:data.coShort, 
                prodType:"Courses", 
                coAuth: data.coAuth,
                coCat: data.coCat,
                coElg: data.coElg,
                coImg: data.coImg,
                coType: data.coType,
                coWhatGrp: data.coWhatGrp,
                coTeleGrp: data.coTeleGrp,
                coDesc:data.coDesc, 
                coDon:data.coDon, 
                durDays:data.durDays, 
                durHrs:data.durHrs, 
                // usrId: loggedInUser.result._id
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/course-list');
          }
      } catch (error) {
          toast.error('Error creating course.');
      } 
    };  

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-auto border-[1.5px] border-orange-500 p-9 rounded-md">
        <div className="grid grid-cols-2 gap-4">
            <div className="w-full h-[250px]">
                <Image src='/images/sadhak.jpg' alt='sadhak' width={600} height={250} />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Course Title:</label>
                    <input type='text' name="coName" value={data.coName} onChange={handleChange} className='inputBox'/>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <div className="flex flex-col gap-2">
                        <label className='text-lg'>Nick Name:</label>
                        <input type='text' name="coNick" value={data.coNick} onChange={handleChange} className='inputBox'/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='text-lg'>Category:</label>
                        <select name="coCat" value={data.coCat} onChange={handleChange} className='inputBox h-[45px]'>
                            <option className="text-center">--- Select Category ---</option>
                            {cat.map((item) => {
                                return (
                                    <option key={item._id} value={item._id}>{item.catName}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Short Intro:</label>
                    <textarea name="coShort" value={data.coShort} onChange={handleChange} rows={3} className='inputBox'/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-lg'>Elegibility:</label>
                    <select name="coElg" value={data.coElg} onChange={handleChange} className='inputBox'>
                        <option className="text-center">--- Select Elegibility ---</option>
                        <option value="None">None</option>
                        <option value="Basic Education - 2">BSK-1</option>
                        <option value="Basic Education - 3">BSK-2</option>
                        <option value="Higher Education">BASIC EDC-1</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Course Duration-DAYS:</label>
                <input name="durDays" value={data.durDays} onChange={handleChange} type='number' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Course Duration-HRS:</label>
                <input name="durHrs" value={data.durHrs} onChange={handleChange} type='number' className='inputBox'/>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Course Type:</label>
                <select name="coType" value={data.coType} onChange={handleChange} className='inputBox'>
                    <option className="text-center">--- Select Type ---</option>
                    <option value="Donation">Donation</option>
                    <option value="Free">Free</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Donation:</label>
                <input name="coDon" value={data.coDon} onChange={handleChange} type='number' className='inputBox'/>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Telegram Group - Waiting:</label>
                <input name="coTeleGrp" value={data.coTeleGrp} onChange={handleChange} type='text' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>WhatsApp group - Waiting:</label>
                <input name="coWhatGrp" value={data.coWhatGrp} onChange={handleChange} type='text' className='inputBox'/>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Description:</label>
            <textarea name="coDesc" value={data.coDesc} onChange={handleChange} rows={6} className='inputBox'/>
        </div>
        {errorMessage && <p className="text-xs italic text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/course-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewCourse;
