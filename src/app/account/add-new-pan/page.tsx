"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Loading from "../Loading";

interface AddNewPanProps {
  sdkDocType: string;
  sdkDocOwnr: string;
  sdkUpldDate: Date;
  sdkDocRel: string;
  sdkPan: string;
  sdkPanNbr: string;
  createdBy?: string;
}

const AddNewPan: React.FC = () => {

  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [image , setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AddNewPanProps>({
    sdkDocType: "",
    sdkDocOwnr: "",
    sdkUpldDate: new Date(),
    sdkDocRel: "",
    sdkPan: "",
    sdkPanNbr: "",
    createdBy: "",
  });
  
  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });

  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || "";
      const userName = Cookies.get("loggedInUserName") || "";
      const userRole = Cookies.get("loggedInUserRole") || "";
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

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  
  const handleFileChange = (e: any) => {
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
    const img = new window.Image();
    if (image instanceof File) {
        img.src = URL.createObjectURL(image);
    } else {
        toast.error("Invalid image format!");
        return;
    }

    const formData = new FormData();
    formData.append("panImage", image);
    try {
      const res = await fetch("/api/pan-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success === true) {
        toast.success(data.msg);
        setImage(data.imageUrl);
      } else {
        toast.error(data.msg);
      }
    } catch (error:any) {
        toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/documents`, {
        method: "POST",
        body: JSON.stringify({
          sdkDocType: "Pan",
          sdkDocOwnr: data.sdkDocOwnr,
          sdkUpldDate: new Date(),
          sdkPanNbr: data.sdkPanNbr,
          sdkDocRel: data.sdkDocRel,
          sdkPan: image,
          createdBy: loggedInUser.result._id,
        }),
      });

      const post = await response.json();
      console.log(post);

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/my-docs/pan-card");
      }
    } catch (error) {
      toast.error("Error uploading document.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center my-8">
      <form className="formStyle w-[600px]" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Pan:</label>
            <input
              type="text"
              className="inputBox"
              name="sdkPanNbr"
              value={data.sdkPanNbr}
              onChange={handleChange}
              placeholder="Enter pan number"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Owner of Pan:</label>
            <input
              className="inputBox"
              name="sdkDocOwnr"
              value={data.sdkDocOwnr}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Relation:</label>
            <input
              className="inputBox"
              name="sdkDocRel"
              value={data.sdkDocRel}
              onChange={handleChange}
            />
          </div>
          {preview ?
            (
              <div className="w-full h-[350px] border-[1.5px] bg-gray-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ): null
          }
          <div className="flex flex-col gap-2">
            <label className="text-lg">Pan Image:</label>
            <div className="flex gap-1">
              <input
                type="file"
                className="inputBox w-full"
                name="sdkPan"
                onChange={handleFileChange}
              />
              <button type="button" className="btnRight" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading...": "Upload"}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full mt-3">
          <button type="submit" className="btnLeft w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/my-docs/pan-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewPan;
