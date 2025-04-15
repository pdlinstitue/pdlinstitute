"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
 

interface IDocParams {
  params:Promise <{
    DocId?: string
  }>
}

interface EditPanCardProps  {
    _id?: string;
    sdkDocOwnr: string;
    sdkUpldDate: Date;
    sdkDocRel: string;
    sdkAdsProof: string;
    sdkAdsNbr: string;
    updatedBy?: string;
  };

const EditMyAdsCard: React.FC <IDocParams> = ({params}) => {

  const router = useRouter();
  const {DocId} = use(params);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [data, setData] = useState<EditPanCardProps>({sdkDocOwnr:'', sdkUpldDate:new Date(), sdkDocRel:'', sdkAdsProof:'', sdkAdsNbr:'', updatedBy:''});
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
  const fetchAdsData = async () => {
    try {
        const res = await fetch(`/api/documents/${DocId}/view-doc`);
        const data = await res.json();
        setData(data.docById);
    } catch (error) {
        console.error("Error fetching idData: ", error);
    } finally {
        setIsLoading(false);
    }
  }
  fetchAdsData();
  },[]);

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) =>{
        return {
            ...prev, [name]: value
        }
    });     
  };

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
    formData.append("addsImage", image);
    formData.append("addsImageFileName", data.sdkAdsProof);
  
      try {
        const res = await fetch("/api/adds-upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        if (data.success) {
          toast.success("Adds uploaded successfully!");            
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

  const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
  e.preventDefault();      
  setIsSaving(true);
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/documents/${DocId}/edit-doc`, {
            method: 'PUT',
            body: JSON.stringify({
                sdkDocOwnr: data.sdkDocOwnr, 
                sdkUpldDate: new Date(), 
                sdkDocRel: data.sdkDocRel, 
                sdkAdsProof: image, 
                sdkAdsNbr: data.sdkAdsNbr,
                updatedBy: loggedInUser.result._id
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
            toast.error(post.msg);
          } else {
            toast.success(post.msg);
            router.push('/account/my-docs/ads-card');
          }
        } catch (error) {
            toast.error('Error updating adds.');
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
    <div className="flex items-center justify-center my-10">
      <form className="formStyle w-[450px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Doc Owner:</label>
          <input className='inputBox' name="sdkDocOwnr" value={data.sdkDocOwnr}  onChange={handleChange}/>
        </div> 
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Relation:</label>
            <input className='inputBox' name="sdkDocRel" value={data.sdkDocRel}  onChange={handleChange}/>
        </div> 
        <div className="w-full h-[350px] border-[1.5px] bg-gray-100">
          <img
              src={data.sdkAdsProof || preview || "/images/uploadImage.jpg"}
              alt="adsCard"
              className="w-full h-full object-contain"
          />
        </div>    
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Upload ID:</label>
          <div className="flex gap-1">
            <input type='file' className='inputBox w-full' name="sdkAdsProof" onChange={handleFileChange}/>
            <button type='button' className='btnRight' onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className='text-lg'>ID No:</label>
          <input type='text' className='inputBox'name="sdkIdNbr" value={data.sdkAdsNbr} onChange={handleChange}/>
        </div>
        <div className="flex gap-1 w-full mt-3">
          <button type="submit" className="btnLeft w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/my-docs/ads-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditMyAdsCard;

