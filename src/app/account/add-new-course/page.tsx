"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";

type CatListType = {
  _id: string;
  catName: string;
};

type CoListType = {
  _id: string;
  coNick: string;
};

interface AddNewCourseProps {
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
  createdBy: string;
}

const AddNewCourse: React.FC = () => {

  const router = useRouter();
  const [cat, setCat] = useState<CatListType[]>([]);
  const [courseList, setCourseList] = useState<CoListType[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [data, setData] = useState<AddNewCourseProps>({
    coName: "",
    coNick: "",
    coShort: "",
    coType: "",
    coDon: 0,
    coDesc: "",
    prodType: "Courses",
    coCat: "",
    coElgType: "",
    coElg: "",
    coWhatGrp: "",
    coTeleGrp: "",
    durDays: 0,
    durHrs: 0,
    coImg: "",
    createdBy: "",
  });

  const loggedInUser = {
    result: {
      _id: Cookies.get("loggedInUserId"),
      usrName: Cookies.get("loggedInUserName"),
      usrRole: Cookies.get("loggedInUserRole"),
    },
  };

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

  useEffect(() => {
    async function fetchCourseData() {
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
    fetchCourseData();
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

    const formData = new FormData();
    formData.append("courseImage", image);

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
        const response = await fetch(`${BASE_API_URL}/api/courses`, {
          method: "POST",
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
            createdBy: loggedInUser.result._id,
          }),
        });

        const post = await response.json();

        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push("/account/course-list");
        }
      } catch (error) {
        toast.error("Error creating course.");
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
      <form
        onSubmit={handleSubmit}
        className="formStyle w-full h-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="w-full h-auto border-[1.5px] bg-gray-100 ">
                <Image
                src={preview}
                alt="course"
                width={600}
                height={350}
                />
            </div>
            <div className="flex items-center gap-1">
                <input type="file" accept="image/*"  className="inputBox w-full h-[45px]" onChange={handleFileChange}></input>
                <button type="button" className="btnLeft" onClick={handleUpload} >UPLOAD</button>
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
                  {data.coElgType === "Course"
                    ? courseList.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.coNick}
                        </option>
                      ))
                    : data.coElgType === "Category"
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
export default AddNewCourse;
