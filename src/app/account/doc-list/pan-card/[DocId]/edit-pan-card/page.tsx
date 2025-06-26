"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface IDocParams {
  params: Promise<{
    DocId?: string;
  }>;
}

interface EditPanCardProps {
  _id?: string;
  sdkDocOwnr: string;
  sdkUpldDate: Date;
  sdkDocRel: string;
  sdkPan: string;
  sdkPanNbr: string;
  updatedBy?: string;
}

const EditPanCard: React.FC<IDocParams> = ({ params }) => {
  const router = useRouter();
  const { DocId } = use(params);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string | null>(null);
  const [data, setData] = useState<EditPanCardProps>({
    sdkDocOwnr: "",
    sdkUpldDate: new Date(),
    sdkDocRel: "",
    sdkPan: "",
    sdkPanNbr: "",
    updatedBy: "",
  });
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
    const fetchPanData = async () => {
      try {
        const res = await fetch(`/api/documents/${DocId}/view-doc`);
        const data = await res.json();
        setData(data.docById);
      } catch (error) {
        console.error("Error fetching panData: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPanData();
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

    // Validate image type
    const img = new window.Image();
    if (image instanceof File) {
      img.src = URL.createObjectURL(image);
    } else {
      toast.error("Invalid image format!");
      return;
    }

    const formData = new FormData();
    formData.append("panImage", image);
    formData.append("panImageFileName", data.sdkPan);

    try {
      const res = await fetch("/api/pan-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Pan uploaded successfully!");
        setImage(data.imageUrl);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/documents/${DocId}/edit-doc`,
        {
          method: "PUT",
          body: JSON.stringify({
            sdkDocOwnr: data.sdkDocOwnr,
            sdkUpldDate: new Date(),
            sdkDocRel: data.sdkDocRel,
            sdkPan: image,
            sdkPanNbr: data.sdkPanNbr,
            updatedBy: loggedInUser.id,
          }),
        }
      );

      const post = await response.json();
      console.log(post);

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/doc-list/pan-card");
      }
    } catch (error) {
      toast.error("Error updating pan.");
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
    <div className="flex items-center justify-center my-10">
      <form className="formStyle w-auto" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: IMAGE */}
          <div className="w-full h-[380px] bg-gray-100">
            {data.sdkPan ? (
              <Image
                src={`/api/pan-upload?name=${data.sdkPan}`}
                alt="PanCard"
                className="w-full h-full object-contain"
                width={500}
                height={400}
              />
            ) : preview ? (
              <Image
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
                width={500}
                height={400}
              />
            ) : (
              <p className="text-center text-gray-500 flex items-center justify-center h-full">
                No image uploaded
              </p>
            )}
          </div>
          {/* RIGHT COLUMN: FORM FIELDS */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Pan Number:</label>
              <input
                type="text"
                className="inputBox"
                name="sdkPanNbr"
                value={data.sdkPanNbr}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Pan Owner:</label>
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
            <div className="flex flex-col gap-2">
              <label className="text-lg">Upload Image:</label>
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  accept="image/*"
                  className="inputBox h-11 w-full"
                  name="sdkPan"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="btnLeft"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/doc-list/pan-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditPanCard;
