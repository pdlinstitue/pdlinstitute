"use client";
import Loading from '@/app/account/Loading';
import { useRouter } from 'next/navigation';
import React, { use, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface IAtdParams {
  params:Promise<{
    BthId: string;
    ClsId: string;
  }>;
}

interface AttdImagesProps {
  bthId: string;
  clsId: string;
  attdScreenshots: string[];
}
  

const AttdImages: React.FC<IAtdParams> = ({ params }) => {
    
  const { BthId, ClsId } = use(params); 
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [attdImages, setAttdImages] = useState<AttdImagesProps>({
    bthId: "",
    clsId: "",
    attdScreenshots: [],
  });

  useEffect(() => {
    setIsLoading(false); // Simulating loading state
  }, []);

  // Handle file selection for upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle file removal from preview and files array
  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
      async function fetchScreenshots() {
        try {
          const res = await fetch(`/api/attd-screenshots?bthId=${BthId}&clsId=${ClsId}`, { cache: "no-store" });
          const screenshots = await res.json();
          
          setAttdImages(screenshots.srnshots);  
          setPreviews(screenshots.srnshots[0]?.attdSreenShots)        
          setUploadedImageUrls(screenshots.srnshots[0]?.attdSreenShots)        
        } catch (error) {
            console.error("Error fetching class data:", error);
        } finally {
            setIsLoading(false);
        }
      }
      fetchScreenshots();
      }, []);

  // Upload images and generate URLs
  const handleImageUpload = async () => {
    if (!files.length) {
      alert("Please select at least one image.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("attdImage", file));

    try {
      const response = await fetch("/api/attd-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      setUploadedImageUrls(data.imageUrls);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false); // ✅ Re-enable button
    }
  };

  // Store bthId, clsId, and image URLs in the database
  const handleSubmit = async () => {

    if (!uploadedImageUrls.length) {
      alert("Please upload images first.");
      return;
    }

    setIsSubmitting(true); 

    try {

      const response = await fetch("/api/attd-screenshots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bthId: BthId,
            clsId: ClsId,
            attdSreenShots: uploadedImageUrls,
          }),
      });

      if (!response.ok) {
        throw new Error("Failed to store data");
      }
      const data = await response.json();
      if(data.success === false){
        toast.error(data.msg);
      } else {
        toast.success(data.msg);
      }
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsSubmitting(false); // ✅ Re-enable button
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
    <div className="flex items-center justify-center">
      <div className="formStyle w-full my-24">
        <h2 className="mb-4 text-xl font-bold">Upload Attendance Images</h2>
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-1'>
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileChange}
            className="inputBox w-full"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            className="btnRight"
            disabled={isUploading} // ✅ Disable when uploading
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <div className='grid grid-cols-2 gap-1'>
          <button
            type='submit'
            onClick={handleSubmit}
            className="btnLeft"
            disabled={isSubmitting} // ✅ Disable when submitting
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type='button'
            className="btnRight"
            onClick={()=>router.push("/account/attendance-list")}
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttdImages;
