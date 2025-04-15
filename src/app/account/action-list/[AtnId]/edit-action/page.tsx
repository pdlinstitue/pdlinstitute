"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import React, { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";


interface IActionParams{
    params: Promise<{
        AtnId: string;
    }>
}
interface EditActionProps {
    atnName:string, 
    viewUrl:string,
    listUrl:string,
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
    regPwdUrl:string,
    updatedBy: string,
}

const EditAction: React.FC<IActionParams> = ({params}) => {

  const router = useRouter();
  const { AtnId } = use(params);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<EditActionProps>({
    atnName:"", 
    viewUrl:"",
    listUrl:"",
    addUrl:"",
    editUrl:"",
    enableUrl:"",
    disableUrl:"",
    deleteUrl:"",
    amendUrl:"", 
    attdeesUrl:"", 
    attdImgUrl:"",
    markUrl:"",
    compUrl:"",
    apvEnrUrl:"",
    mnlEnrUrl:"",
    apvDocUrl:"",
    regPwdUrl:"",
    updatedBy: ""
  });

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {

    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(""); // Clear the previous error
    
    try {
      if (!data.atnName.trim()) {
        setErrorMessage("Module name is required.");
      } else {
        const response = await fetch(`${BASE_API_URL}/api/actions/${AtnId}/edit-action`, {
          method: "PUT",
          body: JSON.stringify({
            atnName: data.atnName,
            viewUrl:data.viewUrl,
            listUrl:data.listUrl,
            addUrl:data.addUrl,
            editUrl:data.editUrl,
            enableUrl:data.enableUrl,
            disableUrl:data.disableUrl,
            deleteUrl:data.deleteUrl,
            markUrl:data.markUrl,
            amendUrl:data.amendUrl,
            attdeesUrl:data.attdeesUrl,
            attdImgUrl:data.attdImgUrl,
            compUrl:data.compUrl,
            apvEnrUrl:data.apvEnrUrl,
            mnlEnrUrl:data.mnlEnrUrl,
            apvDocUrl:data.apvDocUrl,
            regPwdUrl:data.regPwdUrl,
            updatedBy: loggedInUser.result?._id,
          }),
        });
        const post = await response.json();
        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push("/account/action-list");
        }
      }
    } catch (error) {
        toast.error("Error creating action.");
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
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="formStyle w-[800px]">
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
        {errorMessage && (<p className="text-red-600 italic text-sm">{errorMessage}</p>)}
        <div className="flex gap-1 w-full">
          <button 
            type="submit" 
            disabled={isSaving}
            className="btnLeft w-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/action-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAction;
