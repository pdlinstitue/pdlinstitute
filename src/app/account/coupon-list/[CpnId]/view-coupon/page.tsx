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

interface ICpnParams {
  params: Promise<{
    CpnId: String;
  }>;
}

interface EditCouponProps {
  cpnName: string;
  cpnUse: number;
  cpnVal: number;
  cpnDisType: string;
  cpnDisc: number;
  cpnCourse: string;
  cpnFor: string;
  cpnSdk: [string];
  updatedBy: string;
}

const ViewCoupon: React.FC<ICpnParams> = ({ params }) => {
  const router = useRouter();
  const { CpnId } = use(params);
  const [coData, setCoData] = useState<CourseDataProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<EditCouponProps>({
    cpnName: "",
    cpnUse: 0,
    cpnVal: 0,
    cpnDisType: "",
    cpnDisc: 0,
    cpnCourse: "",
    cpnFor: "",
    cpnSdk: [""],
    updatedBy: "",
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

  useEffect(() => {
    async function fetchCouponByID() {
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/coupons/${CpnId}/view-coupon`,
          { cache: "no-store" }
        );
        const couponData = await res.json();
        setData(couponData.cpnById);
        setCouponFor(couponData.cpnById.cpnFor);
        setManageBox(couponData.cpnById.cpnSdk || []);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCouponByID();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center my-4">
      <form className="formStyle w-[450px]">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Coupon Name:</label>
          <input
            type="text"
            className="inputBox"
            name="cpnName"
            value={data.cpnName}
            readOnly
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
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Validity:</label>
            <input
              type="number"
              className="inputBox"
              name="cpnVal"
              value={data.cpnVal}
              readOnly
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
              disabled
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
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg">Course:</label>
          <select
            className="inputBox"
            name="cpnCourse"
            value={data.cpnCourse}
            disabled
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
                checked={data.cpnFor === "All"}
                disabled
              />{" "}
              All Sadhak
            </label>
            <label className="text-lg">
              <input
                type="radio"
                name="couponFor"
                value="Specific"
                checked={data.cpnFor === "Specific"}
                disabled
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
                  readOnly
                />
              </div>
            ))}
          </div>
        )}
        {errorMessage && (
          <p className="text-sm italic text-red-600">{errorMessage}</p>
        )}
        <div className="flex gap-1 w-full">
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
export default ViewCoupon;