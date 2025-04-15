"use client";
import React, { FormEvent, use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/app/account/Loading';
import { BASE_API_URL } from '@/app/utils/constant';
import Cookies from 'js-cookie';

interface IPrcParams {
    params: Promise<{
        PrcId?: string;
    }>;
}

interface EditPracticeClassProps {
  prcName:string,
  prcImg:string,
  prcLang:string,
  prcDays:string[],
  prcStartsAt:string,
  prcEndsAt:string,
  prcLink:string,
  prcWhatLink: string,
  updatedBy?:string
 }

const EditPracticeClass : React.FC<IPrcParams> = ({params}) => {

  const router = useRouter();
  const {PrcId} = use(params);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pracDays, setPracDays] = useState<string[] | null>([])
  const [data, setData] = useState<EditPracticeClassProps>({prcName:'', prcLang:'', prcDays:[''], prcStartsAt:'', prcEndsAt:'', prcLink:'', prcWhatLink:'',  prcImg:'', updatedBy:''});
  const practiceDays : string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];


  useEffect(() =>{
  async function fetchPracticeClassData() {
  try 
    {
        const prcData = await fetch(`${BASE_API_URL}/api/course-practice/${PrcId}/view-practice-class` , {cache: "no-store"});
        const prcClassById = await prcData.json();
        setData(prcClassById.prcById);
        setPracDays(prcClassById.prcById.prcDays);

    } catch (error) {
        console.error("Error fetching practiceClassData: ", error);
    } finally{
      setIsLoading(false);
    }
  }
  fetchPracticeClassData();
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

  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {

    if (!image) {
      toast.error("Please select an image!");
      return;
    }

    setIsUploading(true);
  
    // Validate image type
    const img = new window.Image();
    if (image instanceof File) {
        img.src = URL.createObjectURL(image);
    } else {
        toast.error("Invalid image format!");
        return;
    }

    const formData = new FormData();
    formData.append("prcImage", image);
    formData.append("prcImageFileName", data.prcImg);
  
      try {
        const res = await fetch("/api/prc-upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        if (data.success) {
          toast.success("Image uploaded successfully!");            
          setImage(data.imageUrl);
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (error:any) {
        toast.error(error.message);
      } finally {
        setIsUploading(false);
      }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, day: string) => {
    const { checked } = event.target;
    let updatedDays = [...(pracDays || [])];  
    if (checked) {
      updatedDays.push(day);
    } else {
      updatedDays = updatedDays.filter(d => d !== day);
    }
    setPracDays(updatedDays);
  };

  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: '',
      usrName: '',
      usrRole: '',
    },
  });
   
  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || '';
      const userName = Cookies.get("loggedInUserName") || '';
      const userRole = Cookies.get("loggedInUserRole") || '';
      setLoggedInUser({
        result: {
          _id: userId,
          usrName: userName,
          usrRole: userRole,
        },
      });
    } catch (error) {
        console.error("Error fetching loggedInUserData.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  

    const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {

      e.preventDefault();
      setIsSaving(true);
      setErrorMessage(''); // Clear the previous error
       
      try {
        if (!data.prcName.trim()) {
          setErrorMessage('Class name is must.');    
        } else if (!data.prcStartsAt.trim()) {
            setErrorMessage('Please fix start time.');    
        } else if (!data.prcEndsAt.trim()) {
            setErrorMessage('Please fix end time.');    
        } else if (!data.prcLang.trim()) {
          setErrorMessage('Please Choose language.');    
        } else if (!data.prcLink.trim()) {
          setErrorMessage('Please provide meeting link.');    
        } else {
          const response = await fetch(`${BASE_API_URL}/api/course-practice/${PrcId}/edit-practice-class`, {
            method: 'PUT',
            body: JSON.stringify({ 
              prcName:data.prcName,
              prcImg:image,
              prcLang:data.prcLang,
              prcDays:pracDays,
              prcStartsAt:data.prcStartsAt,
              prcEndsAt:data.prcEndsAt,
              prcLink:data.prcLink,
              prcWhatLink: data.prcWhatLink,
              updatedBy: loggedInUser.result._id
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/course-practice');
          }
        }
      } catch (error) {
        toast.error('Error updating practice class.');
      } finally {
        setIsSaving(false);
      }
    };

  if(isLoading){
    return<div>
      <Loading/>
    </div>
  }

  return (
    <div className='flex justify-center items-center my-4 '>
      <form onSubmit={handleSubmit} className='formStyle w-[500px]'>
      <div className="flex flex-col gap-1">
        <div className="w-full h-[350px] border-[1.5px] bg-gray-100">
          <img
            src={data.prcImg || preview || "/images/uploadImage.jpg"}
            alt="course"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept="image/*"
            className="inputBox w-full h-[45px]"
            onChange={handleFileChange}
          ></input>
          <button type="button" className="btnLeft" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <label>Class Name:</label>
          <input type='text' className='inputBox' name='prcName' value={data.prcName} onChange={handleChange} placeholder='Enter class name'/>
        </div>
        <div className='grid grid-cols-3 gap-1 w-full'>
            <div className='flex flex-col gap-2 w-full'>
                <label>Starts At:</label>
                <input type='time' className='inputBox' name='prcStartsAt' value={data.prcStartsAt} onChange={handleChange}/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Ends At:</label>
                <input type='time' className='inputBox' name='prcEndsAt' value={data.prcEndsAt} onChange={handleChange}/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Language:</label>
                <select className='inputBox h-[46px]' name='prcLang' value={data.prcLang} onChange={handleChange}>
                  <option>--- Select ---</option>
                  <option  value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
            </div>
        </div>
        <div className='flex flex-col gap-2 w-full mb-2'>
          <label>Practice Days:</label>
          <div className='grid grid-cols-7 gap-1 w-full'>
          { practiceDays.map((item, index) => ( 
            <div key={index} className='flex items-center gap-2 w-full'> 
              <input 
                type='checkbox' 
                value={item} 
                checked={pracDays?.includes(item)}
                onChange={(e) => handleCheckboxChange(e, item)} 
              /> 
              <label>{item}</label> 
            </div> )) 
          }
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>WhatsApp Group Link:</label>
            <input type='text' className='inputBox' name='prcWhatLink' value={data.prcWhatLink} onChange={handleChange}/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>Meeting Link:</label>
            <input type='text' className='inputBox' name='prcLink' value={data.prcLink} onChange={handleChange}/>
        </div>
        {errorMessage && <p className="text-sm italic text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full mt-4">
            <button type="submit" className="btnLeft w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/course-practice")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default EditPracticeClass;
