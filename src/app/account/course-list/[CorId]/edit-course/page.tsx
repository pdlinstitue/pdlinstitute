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
  _id: string;
  catName: string;
};
interface ICourseParams {
  params: Promise<{
    CorId?: string;
  }>;
}
interface EditCourseProps {
  coName: string;
  coNick: string;
  coShort: string;
  prodType: string;
  coCat: string;
  coElgType: string;
  coElg: string;
  coImg: string;
  coType: string;
  coWhatGrp: string;
  coTeleGrp: string;
  coDesc: string;
  coDon: number;
  durDays: number;
  durHrs: number;
  updatedBy: string;
}

type CoListType = {
  _id: string;
  coNick: string;
};

const EditCourse: React.FC<ICourseParams> = ({ params }) => {

  const router = useRouter();
  const { CorId } = use(params);
  const [cat, setCat] = useState<CatType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseList, setCourseList] = useState<CoListType[]>([]);
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<EditCourseProps>({
    coName: "",
    coNick: "",
    coShort: "",
    coType: "",
    coElgType: "",
    coDon: 0,
    coDesc: "",
    prodType: "Courses",
    coCat: "",
    coElg: "",
    coWhatGrp: "",
    coTeleGrp: "",
    durDays: 0,
    durHrs: 0,
    coImg: "",
    updatedBy: "",
  });

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
    async function fetchCatData() {
      try {
        const catdata = await fetch(`${BASE_API_URL}/api/categories`, {
          cache: "no-store",
        });
        const catValues = await catdata.json();
        setCat(catValues.catList);
      } catch (error) {
        console.error("Error fetching category data: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCatData();
  }, []);

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
  
    // Validate file size (≤ 100 KB)
    if (image instanceof File && image.size > 100 * 1024) {
      toast.error("File size must be 100 KB or less!");
      return;
    }
  
    // Validate image type
    const img = new window.Image();
    if (image instanceof File) {
        img.src = URL.createObjectURL(image);
    } else {
        toast.error("Invalid image format!");
        return;
    }

    // Validate image resolution
    img.onload = async () => {
      if (img.width !== 600 || img.height !== 350) {
        toast.error("Image must be 600x350 pixels!");
        return;
      }
  
      const formData = new FormData();
      formData.append("courseImage", image);
      formData.append("courseImageFileName", data.coImg);
  
      try {
        const res = await fetch("/api/image-upload", {
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
      }
    };
  };

  useEffect(() => {
    async function fetchCourseById() {
      try {
        const corData = await fetch(
          `${BASE_API_URL}/api/courses/${CorId}/view-course`,
          { cache: "no-store" }
        );
        const courseById = await corData.json();
        setData(courseById.corById);
      } catch (error) {
        console.error("Error fetching category data: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseById();
  }, []);

  useEffect(() => {
    async function fetchCourseListData() {
      try {
        const courseData = await fetch(`${BASE_API_URL}/api/courses`, {
          cache: "no-store",
        });
        const corList = await courseData.json();
        setCourseList(corList.coList);
      } catch (error) {
        console.error("Error fetching course data: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseListData();
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(""); // Clear the previous error

    if (!data.coName.trim()) {
      setErrorMessage("Course title is must.");
    } else if (!data.coNick.trim()) {
      setErrorMessage("Nick name is must.");
    } else if (!data.coCat.trim()) {
      setErrorMessage("Please select category.");
    } else if (!data.coType.trim()) {
      setErrorMessage("Please select course type.");
    } else if (!data.coElgType.trim()) {
      setErrorMessage("Please select elegibility type.");
    } else if (!data.coElg.trim()) {
      setErrorMessage("Please select elegibility.");
    } else if (data.durDays <= 1) {
      setErrorMessage("Please duration days.");
    } else if (data.durHrs <= 1) {
      setErrorMessage("Please duration hours.");
    } else if (!data.coShort.trim()) {
      setErrorMessage("Please enter course introduction.");
    } else {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/courses/${CorId}/edit-course`,
          {
            method: "PUT",
            body: JSON.stringify({
              coName: data.coName,
              coNick: data.coNick,
              coShort: data.coShort,
              prodType: "Courses",
              coCat: data.coCat,
              coElg: data.coElg,
              coImg: image,
              coElgType: data.coElgType,
              coType: data.coType,
              coWhatGrp: data.coWhatGrp,
              coTeleGrp: data.coTeleGrp,
              coDesc: data.coDesc,
              coDon: data.coDon,
              durDays: data.durDays,
              durHrs: data.durHrs,
              updatedBy: loggedInUser.result._id,
            }),
          }
        );

        const post = await response.json();

        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push("/account/course-list");
        }
      } catch (error) {
        toast.error("Error updating course.");
      }
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
    <div>
      <form onSubmit={handleSubmit} className="formStyle w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="w-full h-auto border-[1.5px] bg-gray-100 ">
              <Image src={data.coImg || preview || "/images/uploadImage.jpg"}  alt="sadhak" width={600} height={350} />
            </div>
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*"
                className="inputBox w-full h-[45px]"
                onChange={handleFileChange}
              ></input>
              <button type="button" className="btnLeft" onClick={handleUpload}>
                UPLOAD
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Course Title:</label>
              <input
                type="text"
                name="coName"
                value={data.coName}
                onChange={handleChange}
                className="inputBox"
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Nick Name:</label>
                <input
                  type="text"
                  name="coNick"
                  value={data.coNick}
                  onChange={handleChange}
                  className="inputBox"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Category:</label>
                <select
                  name="coCat"
                  value={data.coCat}
                  onChange={handleChange}
                  className="inputBox h-[45px]"
                >
                  <option className="text-center">
                    --- Select Category ---
                  </option>
                  {cat.map((item) => {
                    return (
                      <option key={item._id} value={item._id}>
                        {item.catName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Short Intro:</label>
              <textarea
                name="coShort"
                value={data.coShort}
                onChange={handleChange}
                rows={3}
                className="inputBox"
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Elg Type:</label>
                <select
                  name="coElgType"
                  value={data.coElgType}
                  onChange={handleChange}
                  className="inputBox"
                >
                  <option className="text-center">
                    --- Select Elg Type ---
                  </option>
                  <option value="Course">Course</option>
                  <option value="Category">Category</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Elegibility:</label>
                <select
                  name="coElg"
                  value={data.coElg}
                  onChange={handleChange}
                  className="inputBox"
                >
                  <option className="text-center">
                    --- Select Elegibility ---
                  </option>
                  <option value="None">None</option>
                  {data.coElg === "Course"
                    ? courseList.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.coNick}
                        </option>
                      ))
                    : data.coElg === "Category"
                    ? cat.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.catName}
                        </option>
                      ))
                    : null}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Course Duration-DAYS:</label>
            <input
              name="durDays"
              value={data.durDays}
              onChange={handleChange}
              type="number"
              className="inputBox"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Course Duration-HRS:</label>
            <input
              name="durHrs"
              value={data.durHrs}
              onChange={handleChange}
              type="number"
              className="inputBox"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Course Type:</label>
            <select
              name="coType"
              value={data.coType}
              onChange={handleChange}
              className="inputBox"
            >
              <option className="text-center">--- Select Type ---</option>
              <option value="Donation">Donation</option>
              <option value="Free">Free</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Donation:</label>
            <input
              name="coDon"
              value={data.coDon}
              onChange={handleChange}
              type="number"
              className="inputBox"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Telegram Group - Waiting:</label>
            <input
              name="coTeleGrp"
              value={data.coTeleGrp}
              onChange={handleChange}
              type="text"
              className="inputBox"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">WhatsApp group - Waiting:</label>
            <input
              name="coWhatGrp"
              value={data.coWhatGrp}
              onChange={handleChange}
              type="text"
              className="inputBox"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg">Description:</label>
          <textarea
            name="coDesc"
            value={data.coDesc}
            onChange={handleChange}
            rows={6}
            className="inputBox"
          />
        </div>
        {errorMessage && (
          <p className="text-xs italic text-red-600">{errorMessage}</p>
        )}
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
