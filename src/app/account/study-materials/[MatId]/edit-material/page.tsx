"use client";
import Loading from '@/app/account/Loading';
import React, { FormEvent, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';

interface EditMaterialProps {
  matName: string, 
  matType: string, 
  matLink: string, 
  matFile: string, 
  corId: string, 
  usrId: string
}

interface IMatParams {
    params: Promise<{
        MatId: string;
    }>;
}

const EditMaterial : React.FC<IMatParams> = ({params}) => {

  const router = useRouter();
  const {MatId} = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [materialBox, setMaterialBox] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [coList, setCoList] = useState<{ _id: string; coNick: string; coName: string }[] | null>([])
  const [data, setData] = useState<EditMaterialProps>({matName:'', corId:'', matType:'', matLink:'', matFile:'', usrId:''});

  const handleMaterialType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === "Audio") {
        setMaterialBox("Audio");
    } else if(e.target.value === "Video") {
        setMaterialBox("Video");
    } else if(e.target.value === "File/Image") {
        setMaterialBox("File/Image");
    }
  }

  useEffect(() => {
    async function fetchMatData() {
    try 
      {
          const res = await fetch(`${BASE_API_URL}/api/materials/${MatId}/view-material`, { cache: "no-store" });
          const materialById = await res.json();
          setData(materialById.matById);
          setMaterialBox(materialById.matById.matType);
      } catch (error) {
          console.error("Error fetching course data:", error);
      }  finally {
          setIsLoading(false);
      }
      }
      fetchMatData();
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

  const handleSubmit = async (e:FormEvent<HTMLFormElement | HTMLSelectElement>):Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error
    let errMsg: string[] = [];
        
    if (!data.matName.trim()) {
        errMsg.push('Please enter material name.');    
    }
    
    if (!data.corId.trim()) {
        errMsg.push('Please select course.');    
    }

    if (!materialBox.trim()) {
        errMsg.push('Please select type.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
      
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/materials/${MatId}/edit-material`, {
            method: 'PUT',
            body: JSON.stringify({
              matName:data.matName, 
              matType:materialBox, 
              corId:data.corId, 
              matLink:data.matLink, 
              matFile:data.matFile, 
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/study-materials');
          }
      } catch (error) {
          toast.error('Error updating study material.');
      } 
    };  
  
    if(isLoading){
      return<div>
        <Loading/>
      </div>
    }

  return (
    <div className='flex items-center justify-center'>
      <form onSubmit={handleSubmit} className="formStyle w-[450px]  my-8">
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Material Title:</label>
            <input type='text' name='matName' value={data.matName} onChange={handleChange} className='inputBox h-[48px]'/>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Course:</label>
            <select name='corId' value={data.corId} onChange={handleChange} className='inputBox'>
                <option className='text-center'>--- Select Course ---</option>
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
            <label className='text-lg'>Material Type:</label>
            <select className='inputBox' name='matType' value={materialBox} onChange={handleMaterialType}>
                <option className='text-center'>--- Select Type ---</option>
                <option value="Audio">Audio</option>
                <option value="Video">Video</option>
                <option value="File/Image">File/Image</option>
            </select>
        </div>
        {
            materialBox === "Audio" && (
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audio/Video Link:</label>
                <input type='text' name='matLink' value={data.matLink} onChange={handleChange} className='inputBox'/>
            </div>
            )
        }
        {
            materialBox === "Video" && (
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Audio/Video Link:</label>
                <input type='text' name='matLink' value={data.matLink} onChange={handleChange} className='inputBox'/>
            </div>
            )
        }
        {
            materialBox === "File/Image" && (
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Upload File:</label>
                <div className='flex gap-1 items-center'>
                    <input type='file' name='matFile' value={data.matFile} onChange={handleChange} className='inputBox w-full h-[47px]'/>
                    <button type='button' className='btnRight'>Upload</button>
                </div>
            </div> 
            )
        }
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}  
        <div className="flex gap-1 w-full mt-4">
            <button type="submit" className="btnLeft w-full">Update</button>
            <button type="button" className="btnRight w-full" onClick={() => router.push("/account/study-materials")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default EditMaterial;
