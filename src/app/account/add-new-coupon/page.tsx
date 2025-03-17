"use client";
import Loading from "@/app/account/Loading";
import React, { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface CourseDataProps {
  _id: string;
  coName: string;
}

interface AddNewCouponProps {
  cpnName: string;
  cpnUse: number;
  cpnVal: number;
  cpnDisType: string;
  cpnDisc: number;
  cpnCourse: string;
  cpnFor: string;
  cpnSdk: [string];
  createdBy: string;
}

const AddNewCoupon: React.FC = () => {
  const router = useRouter();
  const [coData, setCoData] = useState<CourseDataProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<AddNewCouponProps>({
    cpnName: "",
    cpnUse: 0,
    cpnVal: 0,
    cpnDisType: "",
    cpnDisc: 0,
    cpnCourse: "",
    cpnFor: "",
    cpnSdk: [""],
    createdBy: "",
  });
  const [manageBox, setManageBox] = React.useState<string[]>([]);
  const [couponFor, setCouponFor] = useState("");
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

  const handleBox = (index: number | null, operation: string) => {
    if (operation === "Add") {
      setManageBox([...manageBox, ""]);
    } else if (operation === "Remove" && index !== null) {
      setManageBox(manageBox.filter((_, i) => i !== index));
    }
  };

  const handleBoxChange = (index: number, value: string) => {
    const updatedBoxes = [...manageBox];
    updatedBoxes[index] = value;
    setManageBox(updatedBoxes);
  };

  const handleCouponFor = (cpnMadeFor: string) => {
    if (cpnMadeFor === "All") {
      setCouponFor("All");
    } else {
      setCouponFor("Specific");
    }
  };

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, {
          cache: "no-store",
        });
        const coData = await res.json();
        const updatedCoList = coData.coList.map((item: any) => {
          return { ...item, coCat: item.coCat.catName };
        });
        setCoData(updatedCoList);
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
    setData((prev: any) => {
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

    if (!data.cpnName.trim()) {
      errMsg.push("Coupon name is must.");
    }

    if (!data.cpnCourse.trim()) {
      errMsg.push("Please select course.");
    }

    if (!couponFor.trim()) {
      errMsg.push("Please select coupon is for whom.");
    }

    if (errMsg.length > 0) {
      setErrorMessage(errMsg.join(" || "));
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/coupons`, {
        method: "POST",
        body: JSON.stringify({
          cpnName: data.cpnName,
          cpnUse: data.cpnUse,
          cpnVal: data.cpnVal,
          cpnDisType: data.cpnDisType,
          cpnDisc: data.cpnDisc,
          cpnCourse: data.cpnCourse,
          cpnFor: couponFor,
          cpnSdk: manageBox,
          createdBy: loggedInUser.result._id,
        }),
      });

      const post = await response.json();
      console.log(post);

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/coupon-list");
      }
    } catch (error) {
      toast.error("Error creating coupon.");
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
    <div className="flex justify-center items-center my-4">
      <form onSubmit={handleSubmit} className="formStyle w-[450px]">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Coupon Name:</label>
          <input
            type="text"
            className="inputBox"
            name="cpnName"
            value={data.cpnName}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Number of Uses:</label>
            <input
              type="number"
              className="inputBox"
              name="cpnUse"
              value={data.cpnUse}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Validity:</label>
            <input
              type="number"
              className="inputBox"
              name="cpnVal"
              value={data.cpnVal}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Discout Type:</label>
            <select
              className="inputBox"
              name="cpnDisType"
              value={data.cpnDisType}
              onChange={handleChange}
            >
              <option value="Type" className="text-center">
                --- Select Type ---
              </option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Discount:</label>
            <input
              type="number"
              className="inputBox"
              name="cpnDisc"
              value={data.cpnDisc}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg">Course:</label>
          <select
            className="inputBox"
            name="cpnCourse"
            value={data.cpnCourse}
            onChange={handleChange}
          >
            <option value="Type" className="text-center">
              --- Select Course ---
            </option>
            {coData?.map((item: any) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.coName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label>Coupon is for :</label>
          <div className="flex gap-24">
            <label className="text-lg">
              <input
                type="radio"
                name="couponFor"
                value="All"
                defaultChecked
                onChange={(e: any) => handleCouponFor("All")}
              />{" "}
              All Sadhak
            </label>
            <label className="text-lg">
              <input
                type="radio"
                name="couponFor"
                value="Specific"
                onChange={(e: any) => handleCouponFor("Specific")}
              />{" "}
              Specific Sadhak
            </label>
          </div>
        </div>
        {couponFor === "Specific" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Sadhak ID:</label>
            {manageBox.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <input
                  type="text"
                  className="inputBox w-full"
                  value={item || ""}
                  onChange={(e) => handleBoxChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="btnLeft"
                  onClick={() => handleBox(index, "Remove")}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btnRight uppercase"
              onClick={() => handleBox(null, "Add")}
            >
              Add Sadhak ID
            </button>
          </div>
        )}
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/coupon-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewCoupon;
