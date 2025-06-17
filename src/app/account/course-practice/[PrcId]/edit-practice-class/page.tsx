"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Loading from "@/app/account/Loading";
import { BASE_API_URL } from "@/app/utils/constant";
import Cookies from "js-cookie";
import Select from "react-select";

interface IPrcParams {
  params: Promise<{
    PrcId?: string;
  }>;
}

interface EditPracticeClassProps {
  prcName: string;
  prcImg: string;
  prcLang: string;
  prcDays: string[];
  prcStartsAt: string;
  prcEndsAt: string;
  prcLink: string;
  prcWhatLink: string;
  updatedBy?: string;
}
interface CourseListProps {
  _id: string;
  coName: string;
  coNick: string;
}

const EditPracticeClass: React.FC<IPrcParams> = ({ params }) => {
  const router = useRouter();
  const { PrcId } = use(params);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseList, setCourseList] = useState<CourseListProps[] | null>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [pracDays, setPracDays] = useState<string[] | null>([]);
  const [data, setData] = useState<EditPracticeClassProps>({
    prcName: "",
    prcLang: "",
    prcDays: [""],
    prcStartsAt: "",
    prcEndsAt: "",
    prcLink: "",
    prcWhatLink: "",
    prcImg: "",
    updatedBy: "",
  });
  const practiceDays: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thur",
    "Fri",
    "Sat",
  ];

  useEffect(() => {
    async function fetchPracticeClassData() {
      try {
        const prcData = await fetch(
          `${BASE_API_URL}/api/course-practice/${PrcId}/view-practice-class`,
          { cache: "no-store" }
        );
        const prcClassById = await prcData.json();
        setData(prcClassById.prcById);
        setPracDays(prcClassById.prcById.prcDays);
        setSelectedCourse(prcClassById.prcById.prcName._id); 
      } catch (error) {
        console.error("Error fetching practiceClassData: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPracticeClassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, {
          cache: "no-store",
        });
        const coData = await res.json();
        setCourseList(coData.coList);
      } catch (error) {
        console.error("Error fetching course data:", error);
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
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    day: string
  ) => {
    const { checked } = event.target;
    let updatedDays = [...(pracDays || [])];
    if (checked) {
      updatedDays.push(day);
    } else {
      updatedDays = updatedDays.filter((d) => d !== day);
    }
    setPracDays(updatedDays);
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(""); // Clear the previous error

    try {
      if (!selectedCourse.trim()) {
        setErrorMessage("Class name is must.");
      } else if (!data.prcStartsAt.trim()) {
        setErrorMessage("Please fix start time.");
      } else if (!data.prcEndsAt.trim()) {
        setErrorMessage("Please fix end time.");
      } else if (!data.prcLang.trim()) {
        setErrorMessage("Please Choose language.");
      } else if (!data.prcLink.trim()) {
        setErrorMessage("Please provide meeting link.");
      } else {
        const response = await fetch(
          `${BASE_API_URL}/api/course-practice/${PrcId}/edit-practice-class`,
          {
            method: "PUT",
            body: JSON.stringify({
              prcName: selectedCourse,
              prcImg: image,
              prcLang: data.prcLang,
              prcDays: pracDays,
              prcStartsAt: data.prcStartsAt,
              prcEndsAt: data.prcEndsAt,
              prcLink: data.prcLink,
              prcWhatLink: data.prcWhatLink,
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
          router.push("/account/course-practice");
        }
      }
    } catch (error) {
      toast.error("Error updating practice class.");
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
    <div className="flex justify-center items-center py-6">
      <form onSubmit={handleSubmit} className="formStyle w-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <div className="flex flex-col gap-2">
            <div className="w-full h-[296px] border-[1.5px] bg-gray-100">
              {data.prcImg ? (
                <Image
                  src={`/api/prc-upload?name=${data?.prcImg}`}
                  alt="Course cover"
                  width={450}
                  height={296}
                  className="w-full h-full object-cover"
                />
              ) : preview ? (
                <Image
                  src={preview}
                  alt="Profile Preview"
                  width={450}
                  height={296}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                className="inputBox w-full"
                name="prcImg"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btnRight"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label>Class Name:</label>
              <Select
                className="w-full text-center"
                placeholder="--- Select Course ---"
                options={courseList?.map((course) => ({
                  label: course.coName,
                  value: course._id,
                }))}
                value={
                  courseList?.find((c:any) => c._id === selectedCourse)
                    ? {
                        label: courseList.find((c) => c._id === selectedCourse)!
                          .coName,
                        value: selectedCourse,
                      }
                    : null
                }
                onChange={(option) => {
                  setSelectedCourse(option?.value || "");
                }}
                isSearchable
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    padding: "4px",
                    minHeight: "46px",
                    width: "100%", // ⬅ Full width
                    boxShadow: "none", // ⬅ No box shadow regardless of focus
                    border: "1px solid #ea580c", // ⬅ Explicit border styling
                    backgroundColor: state.isFocused ? "#FFEBCC" : "white",
                    "&:hover": {
                      borderColor: "#ea580c", // ⬅ Keep consistent hover color
                    },
                  }),

                  menu: (provided) => ({
                    ...provided,
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 5,
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    paddingTop: "4px",
                    paddingBottom: "4px",
                  }),
                  input: (provided) => ({
                    ...provided,
                    margin: 0,
                    padding: 0,
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#666",
                  }),
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label>Starts At:</label>
                <input
                  type="time"
                  className="inputBox"
                  name="prcStartsAt"
                  value={data.prcStartsAt}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Ends At:</label>
                <input
                  type="time"
                  className="inputBox"
                  name="prcEndsAt"
                  value={data.prcEndsAt}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Language:</label>
                <select
                  className="inputBox h-[46px]"
                  name="prcLang"
                  value={data.prcLang}
                  onChange={handleChange}
                >
                  <option>--- Select ---</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full mb-2">
              <label>Practice Days:</label>
              <div className="grid grid-cols-7 gap-1 w-full">
                {practiceDays?.map((day, index) => (
                  <div key={index} className="flex items-center gap-2 w-full">
                    <input
                      type="checkbox"
                      name="prcDays"
                      value={day}
                      checked={pracDays?.includes(day)}
                      onChange={(e: any) => handleCheckboxChange(e, day)}
                    />
                    <label>{day}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label>WhatsApp Group Link:</label>
              <input
                type="url"
                className="inputBox"
                name="prcWhatLink"
                value={data.prcWhatLink}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label>Meeting Link:</label>
              <input
                type="url"
                className="inputBox"
                name="prcLink"
                value={data.prcLink}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/course-practice")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPracticeClass;
