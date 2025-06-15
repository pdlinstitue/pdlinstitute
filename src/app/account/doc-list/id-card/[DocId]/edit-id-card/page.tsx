"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import toast from "react-hot-toast";
 

interface IDocParams {
  params:Promise <{
    DocId?: string
  }>
}

interface EditIdCardProps  {
    _id?: string;
    sdkDocOwnr: string;
    sdkUpldDate: Date;
    sdkDocRel: string;
    sdkIdProof: string;
    sdkIdNbr: string;
    updatedBy?: string;
  };

const EditIDCard: React.FC <IDocParams> = ({params}) => {

  const router = useRouter();
  const {DocId} = use(params);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string | null>(null);
  const [data, setData] = useState<EditIdCardProps>({sdkDocOwnr:'', sdkUpldDate:new Date(), sdkDocRel:'', sdkIdNbr:'', sdkIdProof:'', updatedBy:''});
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    usrName: "",
    usrRole: "",
    isAdmin: "",
  });

  useEffect(() => {
  try {
    const cookie = Cookies.get("loggedInUser");
    if (cookie) {
        const parsed = JSON.parse(cookie);
        setLoggedInUser({
        id: parsed.id || "",
        usrName: parsed.usrName || "",
        usrRole: parsed.usrRole || "",
        isAdmin: parsed.isAdmin || "", 
      });
    }
    } catch (error) {
      console.error("Error parsing loggedInUser cookie:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const fetchIDData = async () => {
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
  fetchIDData();
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
    formData.append("idImage", image);
    formData.append("idImageFileName", data.sdkIdProof);
  
      try {
        const res = await fetch("/api/id-upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        if (data.success) {
          toast.success("Id uploaded successfully!");            
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
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/documents/${DocId}/edit-doc`, {
            method: 'PUT',
            body: JSON.stringify({
                sdkDocOwnr: data.sdkDocOwnr, 
                sdkUpldDate: new Date(), 
                sdkDocRel: data.sdkDocRel, 
                sdkIdProof: image, 
                sdkIdNbr: data.sdkIdNbr,
                updatedBy: loggedInUser.id,
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/doc-list/id-card');
          }
      } catch (error) {
          toast.error('Error updating id card.');
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
          <label className='text-lg'>ID Number:</label>
          <input type='text' className='inputBox'name="sdkPanNbr" value={data.sdkIdNbr} onChange={handleChange}/>
        </div>
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Owner Name:</label>
          <input className='inputBox' name="sdkDocOwnr" value={data.sdkDocOwnr} placeholder="Enter the name of ID Owner"  onChange={handleChange}/>
        </div> 
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Relation:</label>
            <input className='inputBox' name="sdkDocRel" value={data.sdkDocRel}  onChange={handleChange}/>
        </div>
        <div className="w-full h-[350px] bg-gray-100">
          {preview || data.sdkIdProof ? (
          <img
              src={preview || `/api/id-upload?name=${data.sdkIdProof}`}
              alt="IdCard"
              className="w-full h-full object-contain"
          />
          ) : null}
        </div> 
        <div className="flex flex-col gap-2">
          <label className='text-lg'>Upload ID:</label>
          <div className="flex items-center gap-1">
            <input 
              type='file' 
              accept="image/*"
              onChange={handleFileChange}
              className='inputBox w-full' name="sdkIdProof" 
            />
            <button type="button" className="btnLeft" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <div className="flex gap-1 w-full mt-3">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/doc-list/id-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditIDCard;

