"use client";
import React, { useState, useEffect, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "@/app/account/Loading";
import toast from "react-hot-toast";
import { BASE_API_URL } from "@/app/utils/constant";
import { format } from "date-fns";

interface IClsParams {
  params: Promise<{
    ClsId: string;
    DayId: string;
  }>;
}

type ClassItem = {
  clsDay: string;
  clsStartAt: string;
  clsEndAt: string;
  clsDate: Date;
  clsLink: string;
  updatedBy?: string;
};

const ViewClass: React.FC<IClsParams> = ({ params }) => {

  const router = useRouter();
  const { ClsId, DayId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [assignList, setAssignList] = useState([]);
  const [corId, setCorId] = useState<string | undefined>();
  const [data, setData] = useState<ClassItem | null>({
    clsDay: "",
    clsDate: new Date(),
    clsLink: "",
    clsStartAt: "",
    clsEndAt: "",
    updatedBy: "",
  });  

  // Fetch Class Data
  useEffect(() => {
    async function fetchClassDataById() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/classes/${ClsId}/${DayId}/view-class`,{ cache: "no-store" });

        if (!res.ok){
          throw new Error(`HTTP error! Status: ${res.status}`);
        } 
        const result = await res.json();
        setCorId(result.clsById.corId);
        setData(result.clsById);
      } catch (error) {
          console.error("Error fetching class data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClassDataById();
  }, [ClsId, DayId]);

  // Handle Form Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => (prev ? { ...prev, [name]: value } : null));
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
      <form className="formStyle w-[360px] my-12">
        <div className="flex flex-col gap-2">
          <label>Starts At:</label>
          <input
            type="time"
            className="inputBox"
            name="clsStartAt"
            value={data?.clsStartAt || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Ends At:</label>
          <input
            type="time"
            className="inputBox"
            name="clsEndAt"
            value={data?.clsEndAt || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Meeting Link:</label>
          <input
            type="text"
            className="inputBox"
            name="clsLink"
            value={data?.clsLink || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Class Date:</label>
          <input
            type="date"
            className="inputBox"
            name="clsDate"
            value={data?.clsDate ? format(data.clsDate, "yyyy-MM-dd") : ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-6 w-full mt-3">
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

export default ViewClass;
