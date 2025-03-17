"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Loading from "../Loading";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { BASE_API_URL } from "@/app/utils/constant";

type ClassItem = {
  clsDay: string;
  clsStartAt: string;
  clsEndAt: string;
  clsDate: string;
  clsLink: string;
  clsAssignments: string[];
  createdBy: string | undefined;
};

interface AddNewClassProps {
  clsName: ClassItem[];
  corId: string;
  bthId: string;
  clsMaterials: string[];
}

const AddNewClass: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [course, setCourse] = useState<string[] | null>([]);
  const [clsBatch, setClsBatch] = useState<string[] | null>([]);
  const [courseById, setCourseById] = useState({ coName: "", durDays: 0 });
  const [assignList, setAssignList] = useState([]);
  const [classArray, setClassArray] = useState<ClassItem[]>([]);
  const [data, setData] = useState<AddNewClassProps>({
    clsName: [],
    clsMaterials: [],
    corId: "",
    bthId: "",
  });
  const [startDate, setStartDate] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
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

  const handleInputChange = (
    index: number,
    field: keyof ClassItem,
    value: string
  ) => {
    const updatedArray = [...classArray];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setClassArray(updatedArray);
  };

  useEffect(() => {
    if (
      startAt &&
      endAt &&
      meetingLink &&
      startDate &&
      courseById.durDays > 0
    ) {
      const startDateFrom = new Date(startDate);
      const newClassArray = Array.from(
        { length: courseById.durDays },
        (_, index) => {
          const clsDate = new Date(startDateFrom);
          clsDate.setDate(startDateFrom.getDate() + index);
          return {
            clsDay: `Day ${index + 1}`,
            clsStartAt: startAt,
            clsEndAt: endAt,
            clsDate: clsDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
            clsLink: meetingLink,
            clsAssignments: [],
            createdBy: loggedInUser.result?._id,
          };
        }
      );
      setClassArray(newClassArray);
    }
  }, [startAt, endAt, startDate, meetingLink, courseById.durDays]);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, {
          cache: "no-store",
        });
        const coData = await res.json();
        setCourse(coData.coList);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseData();
  }, []);

  useEffect(() => {
    async function fetchAssignmentData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/assignments`, {
          cache: "no-store",
        });
        const assignmentData = await res.json();
        const asnByCorId = assignmentData.asnList.filter(
          (a: any) => a.corId?._id === data.corId
        );
        setAssignList(asnByCorId);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssignmentData();
  }, [data.corId]);

  useEffect(() => {
    async function fetchBatchesByCorId() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/batches`, {
          cache: "no-store",
        });
        const batchData = await res.json();
        const bthByCorId = batchData.bthList.filter(
          (b: any) => b.corId._id === data.corId
        );
        setClsBatch(bthByCorId);
      } catch (error) {
        console.error("Error fetching batch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBatchesByCorId();
  }, [data.corId]);

  useEffect(() => {
    async function fetchCourseById() {
      if (data.corId) {
        try {
          const res = await fetch(
            `${BASE_API_URL}/api/courses/${data.corId}/view-course`,
            { cache: "no-store" }
          );
          const courseData = await res.json();
          setCourseById(courseData.corById);
        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCourseById({ coName: "", durDays: 0 });
      }
    }
    fetchCourseById();
  }, [data.corId]);

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
    let errMsg: string[] = [];
    if (!data.corId.trim()) {
      errMsg.push("Please select course.");
    }
    if (!data.bthId.trim()) {
      errMsg.push("Please select batch.");
    }
    if (errMsg.length > 0) {
      setErrorMessage(errMsg.join(" || "));
      return;
    }

    try {
      var postData = data;
      postData.clsName = classArray;

      const response = await fetch(`${BASE_API_URL}/api/classes`, {
        method: "POST",
        body: JSON.stringify({ postData }),
      });

      const post = await response.json();
      console.log(post);

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/class-list");
      }
    } catch (error) {
      toast.error("Error creating classes.");
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
        className="flex flex-col gap-2 p-6 border border-orange-500 rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label>Course:</label>
          <select
            className="inputBox"
            name="corId"
            value={data.corId}
            onChange={handleChange}
          >
            <option className="text-center" value="">
              --- Select Course ---
            </option>
            {course?.map((item: any) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.coName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label>Batch</label>
            <select
              className="inputBox"
              name="bthId"
              value={data.bthId}
              onChange={handleChange}
            >
              {/* onChange={(e) => setBatch(e.target.value)} */}
              <option className="text-center">--- Select Batch ---</option>
              {clsBatch?.map((item: any) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.bthName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label>Study Mat:</label>
            <select
              className="inputBox"
              name="clsMaterials"
              value={data.clsMaterials}
              onChange={handleChange}
            >
              <option className="text-center">--- Select Study Mat ---</option>
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="103">103</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label>Starts At:</label>
            <input
              type="time"
              className="inputBox"
              name="startAt"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Ends At:</label>
            <input
              type="time"
              className="inputBox"
              name="endAt"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label>Meeting Link:</label>
            <input
              type="text"
              className="inputBox"
              name="clsLink"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Course Duration:</label>
            <input
              type="number"
              className="inputBox"
              name="durDays"
              value={courseById.durDays}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Start Date:</label>
            <input
              type="date"
              className="inputBox"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full p-3 bg-gray-200 rounded-md text-center text-xl font-semibold">
          <p>List of Classes</p>
        </div>
        {classArray.map((cls, index) => (
          <div key={index} className="grid grid-cols-6 gap-2">
            <input
              type="text"
              className="inputBox"
              name="clsDay"
              value={cls.clsDay}
              onChange={(e) =>
                handleInputChange(index, "clsDay", e.target.value)
              }
            />
            <input
              type="time"
              className="inputBox"
              name="clsStartAt"
              value={cls.clsStartAt}
              onChange={(e) =>
                handleInputChange(index, "clsStartAt", e.target.value)
              }
            />
            <input
              type="time"
              className="inputBox"
              name="clsEndAt"
              value={cls.clsEndAt}
              onChange={(e) =>
                handleInputChange(index, "clsEndAt", e.target.value)
              }
            />
            <input
              type="date"
              className="inputBox"
              name="clsDate"
              value={cls.clsDate}
              onChange={(e) =>
                handleInputChange(index, "clsDate", e.target.value)
              }
            />
            <input
              type="text"
              className="inputBox"
              name="clsLink"
              value={cls.clsLink}
              onChange={(e) =>
                handleInputChange(index, "clsLink", e.target.value)
              }
            />
            <select
              className="inputBox"
              name="clsAssignments"
              value={cls.clsAssignments}
              onChange={(e) =>
                handleInputChange(index, "clsAssignments", e.target.value)
              }
            >
              <option>--- Select ---</option>
              {assignList?.map((item: any) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.asnName}
                  </option>
                );
              })}
            </select>
          </div>
        ))}
        {errorMessage && (
          <p className="text-red-600 italic text-xs">{errorMessage}</p>
        )}
        <div className="flex gap-6 w-full mt-3">
          <button type="submit" className="btnRight w-full">
            Save
          </button>
          <button
            type="button"
            className="btnLeft w-full"
            onClick={() => router.push("/account/class-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewClass;
