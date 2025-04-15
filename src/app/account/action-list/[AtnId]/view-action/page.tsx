"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, use, useEffect, useState } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";


interface IActionParams{
    params: Promise<{
        AtnId: string;
    }>
}

interface ViewActionProps {
    atnName:string, 
    listUrl:string,
    viewUrl:string,
    addUrl:string,
    editUrl:string,
    enableUrl:string,
    disableUrl:string,
    deleteUrl:string,
    markUrl:string,
    amendUrl:string,
    attdeesUrl:string,
    attdImgUrl:string,
    compUrl:string,
    apvEnrUrl:string,
    mnlEnrUrl:string,
    apvDocUrl:string,
    regPwdUrl:string
}

const ViewAction: React.FC<IActionParams> = ({params}) => {

  const router = useRouter();
  const { AtnId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ViewActionProps>({
    atnName:"", 
    listUrl:"",
    viewUrl:"",
    addUrl:"",
    editUrl:"",
    enableUrl:"",
    disableUrl:"",
    deleteUrl:"",
    markUrl:"",
    amendUrl:"",
    attdeesUrl:"",
    attdImgUrl:"",
    compUrl:"",
    apvEnrUrl:"",
    mnlEnrUrl:"",
    apvDocUrl:"",
    regPwdUrl:""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchActionData = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/actions/${AtnId}/view-action`, { cache: "no-store" });
        const actionData = await res.json();
        setData(actionData?.atnById);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setIsLoading(false);
      }
    };
    fetchActionData();
  },[]);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <form className="formStyle w-[800px]">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Module Name:</label>
          <input
            type="text"
            className="inputBox"
            name="atnName"
            value={data?.atnName}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-lg">List Url:</label>
              <input
                type="text"
                className="inputBox"
                name="listUrl"
                value={data?.listUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">View Url:</label>
              <input
                type="text"
                className="inputBox"
                name="viewUrl"
                value={data?.viewUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Add Url:</label>
              <input
                type="text"
                className="inputBox"
                name="addUrl"
                value={data?.addUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Edit Url:</label>
              <input
                type="text"
                className="inputBox"
                name="editUrl"
                value={data?.editUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Enable Url:</label>
              <input
                type="text"
                className="inputBox"
                name="enableUrl"
                value={data?.enableUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Disable Url:</label>
              <input
                type="text"
                className="inputBox"
                name="disableUrl"
                value={data?.disableUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Attendees Url:</label>
              <input
                type="text"
                className="inputBox"
                name="attdeesUrl"
                value={data?.attdeesUrl}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Attd Image Url:</label>
              <input
                type="text"
                className="inputBox"
                name="attdImgUrl"
                value={data?.attdImgUrl}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2"> 
          <div className="flex flex-col gap-2">
            <label className="text-lg">Delete Url:</label>
            <input
              type="text"
              className="inputBox"
              name="deleteUrl"
              value={data?.deleteUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Mark Url:</label>
            <input
              type="text"
              className="inputBox"
              name="markUrl"
              value={data?.markUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Amend Url:</label>
            <input
              type="text"
              className="inputBox"
              name="amendUrl"
              value={data?.amendUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Complete Url:</label>
            <input
              type="text"
              className="inputBox"
              name="compUrl"
              value={data?.compUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Approve Enrollment Url:</label>
            <input
              type="text"
              className="inputBox"
              name="apvEnrUrl"
              value={data?.apvEnrUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Manual Enrollment Url:</label>
            <input
              type="text"
              className="inputBox"
              name="mnlEnrUrl"
              value={data?.mnlEnrUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Approve Docs Url:</label>
            <input
              type="text"
              className="inputBox"
              name="apvDocUrl"
              value={data?.apvDocUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Re-generate Password Url:</label>
            <input
              type="text"
              className="inputBox"
              name="regPwdUrl"
              value={data?.regPwdUrl}
              onChange={handleChange}
            />
          </div>
        </div>
        </div>
        <div className="flex gap-1 w-full">
          <button
            type="button"
            className="btnLeft w-full"
            onClick={() => router.push("/account/action-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewAction;
