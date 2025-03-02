"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { use } from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "@/app/account/Loading";
import { BASE_API_URL } from "@/app/utils/constant";

type CatType = {
    _id:string,
    catName:string
}
interface ICourseParams {
    params: Promise<{
        CorId?: string;
    }>;
}
interface EditCourseProps{
    coName: string, 
    coNick:string,
    coShort:string, 
    prodType:string, 
    coCat: string,
    coElgType: string,
    coElg: string,
    coImg: string,
    coType: string,
    coWhatGrp: string,
    coTeleGrp: string,
    coDesc:string, 
    coDon:number, 
    durDays:number, 
    durHrs:number, 
    updatedBy: string
}

type CoListType = {
    _id:string,
    coNick:string
}

const EditCourse: React.FC<ICourseParams> = ({params}) => {

    const router = useRouter();
    const { CorId } = use(params);
    const [cat, setCat] = useState<CatType[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [courseList, setCourseList] = useState<CoListType[]>([]); 
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState<EditCourseProps>({coName:'', coNick:'', coShort:'', coType:'', coElgType:'', coDon:0, coDesc:'', prodType:'Courses', coCat:'', coElg:'', coWhatGrp:'', coTeleGrp:'', durDays:0, durHrs:0, coImg:'', updatedBy:''})    
    
    const loggedInUser = {
        result:{
          _id:Cookies.get("loggedInUserId"), 
          usrName:Cookies.get("loggedInUserName"),
          usrRole:Cookies.get("loggedInUserRole"),
        }
    };

    useEffect(() =>{
      async function fetchCatData() {
        try {
            const catdata = await fetch(`${BASE_API_URL}/api/categories` , {cache: "no-store"});
            const catValues = await catdata.json();
            setCat(catValues.catList);
        } catch (error) {
            console.error("Error fetching category data: ", error);
        } finally {
            setIsLoading(false);
        }
      }
    fetchCatData();
    },[]);

    useEffect(() =>{
    async function fetchCourseById() {
        try {
            const corData = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course` , {cache: "no-store"});
            const courseById = await corData.json();
            setData(courseById.corById);
        } catch (error) {
            console.error("Error fetching category data: ", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchCourseById();
    },[]);

    useEffect(() =>{
    async function fetchCourseListData() {
        try {
            const courseData = await fetch(`${BASE_API_URL}/api/courses` , {cache: "no-store"});
            const corList = await courseData.json();
            setCourseList(corList.coList);
        } catch (error) {
            console.error("Error fetching course data: ", error);
        } finally {
        setIsLoading(false);
        }
    }
    fetchCourseListData();
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
            
        if (!data.coName.trim()) {
            setErrorMessage('Course title is must.');    
        } else if (!data.coNick.trim()) {
            setErrorMessage('Nick name is must.');    
        } else if (!data.coCat.trim()) {
            setErrorMessage('Please select category.');    
        } else if (!data.coType.trim()) {
            setErrorMessage('Please select course type.');    
        } else if (!data.coElgType.trim()) {
            setErrorMessage('Please select elegibility type.');    
        } else if (!data.coElg.trim()) {
            setErrorMessage('Please select elegibility.');    
        } else if (data.durDays <= 1) {
            setErrorMessage('Please duration days.');    
        } else if (data.durHrs <= 1) {
            setErrorMessage('Please duration hours.');    
        } else if (!data.coShort.trim()) {
            setErrorMessage('Please enter course introduction.');    
        } else {
            try 
          {
              const response = await fetch(`${BASE_API_URL}/api/courses/${CorId}/edit-course`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    coName: data.coName, 
                    coNick: data.coNick,
                    coShort:data.coShort, 
                    prodType:"Courses", 
                    coCat: data.coCat,
                    coElg: data.coElg,
                    coImg: data.coImg,
                    coElgType: data.coElgType,
                    coType: data.coType,
                    coWhatGrp: data.coWhatGrp,
                    coTeleGrp: data.coTeleGrp,
                    coDesc:data.coDesc, 
                    coDon:data.coDon, 
                    durDays:data.durDays, 
                    durHrs:data.durHrs, 
                    updatedBy: loggedInUser.result._id
                }),
              });
          
              const post = await response.json();
           
              if (post.success === false) {
                  toast.error(post.msg);
              } else {
                  toast.success(post.msg);
                  router.push('/account/course-list');
              }
          } catch (error) {
              toast.error('Error creating course.');
          }
        } 
     };  
    
     if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
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
                    <div className="grid grid-cols-2 gap-1">
                        <div className="flex flex-col gap-2">
                            <label className='text-lg'>Elg Type:</label>
                            <select name="coElgType" value={data.coElgType} onChange={handleChange} className='inputBox'>
                                <option className="text-center">--- Select Elg Type ---</option>
                                <option value="Course">Course</option>
                                <option value="Category">Category</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className='text-lg'>Elegibility:</label>
                            <select name="coElg" value={data.coElg} onChange={handleChange} className='inputBox'>
                                <option className="text-center">--- Select Elegibility ---</option>
                                <option value="None">None</option>
                                {
                                    data.coElg === "Course" ? (
                                        courseList.map((item) => (
                                            <option key={item._id} value={item._id}>{item.coNick}</option>
                                        ))
                                    ) : data.coElg === "Category" ? (
                                        cat.map((item) => (
                                            <option key={item._id} value={item._id}>{item.catName}</option>
                                        ))
                                    ) : null
                                }
                            </select>
                        </div>
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
export default EditCourse;
