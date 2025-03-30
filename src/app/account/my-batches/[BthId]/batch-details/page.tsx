"use client";
import React, { FormEvent, useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";

interface IBthParam {
  params:Promise<{
    BthId:string
  }>
}
interface EditBatchProps {
  bthLang: string;
  bthMode: string;
  bthLink: string;
  bthLoc: string;
}

const BatchDetails: React.FC <IBthParam>= ({params}) => {

  const router = useRouter();
  const {BthId} = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EditBatchProps>({
    bthLang: "",
    bthMode: "",
    bthLink: "",
    bthLoc: "",
  });

  // const handleChange = (e: any) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setData((prev) => {
  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });
  // };

  useEffect(() => {
      async function fetchBatchDataById() {
        try {
          const res = await fetch(`${BASE_API_URL}/api/batches/${BthId}/view-batch`, {
            cache: "no-store",
          });
          const batchDetails = await res.json();    
          setData(batchDetails?.bthById);
          console.log(batchDetails?.bthById);
        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchBatchDataById();
    }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <form className="formStyle w-[400px] my-24">
        <div className="grid grid-cols-1 gap-1">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Language:</label>
            <select
              className="inputBox"
              name="bthLang"
              defaultValue={data.bthLang}
            >
              <option className="text-center">--- Select Language ---</option>
              <option value="ENG">English</option>
              <option value="HIN">Hindi</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Mode Of Batch:</label>
            <select
              className="inputBox"
              name="bthMode"
              defaultValue={data.bthMode}
            >
              <option className="text-center">--- Select Mode ---</option>
              <option value="Online">Online</option>
              <option value="Offline w/o acc">Offline w/o acc</option>
              <option value="Offline w acc">Offline w acc</option>
            </select>
          </div>
        </div>
        {data.bthMode === "Offline w acc" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Location:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="bthLoc"
              defaultValue={data.bthLoc}
            />
          </div>
        )}
        {data.bthMode === "Offline w/o acc" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Location:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="bthLoc"
              defaultValue={data.bthLoc}
            />
          </div>
        )}
        <div className="flex gap-1 w-full">
          <button
            type="button"
            className="btnLeft w-full"
            onClick={() => router.push("/account/my-batches")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default BatchDetails;