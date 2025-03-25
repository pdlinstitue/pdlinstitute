"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";

interface AddNewRoleProps {
  roleType: string;
  createdBy?: string;
}

const AddNewRole: React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<AddNewRoleProps>({
    roleType: "",
    createdBy: "",
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(""); // Clear the previous error

    if (!data.roleType.trim()) {
      setErrorMessage("Role is required.");
    } else {
      try {
        const response = await fetch(`${BASE_API_URL}/api/role-list`, {
          method: "POST",
          body: JSON.stringify({
            roleType: data.roleType,
            createdBy: loggedInUser.result?._id,
          }),
        });

        const post = await response.json();
        
        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push("/account/role-list");
        }
      } catch (error) {
        toast.error("Error creating role.");
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
    <div className="flex justify-center items-center my-24">
      <form onSubmit={handleSubmit} className="formStyle w-[350px]">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Role Type:</label>
          <input
            type="text"
            className="inputBox"
            name="roleType"
            value={data.roleType}
            onChange={handleChange}
          />
        </div>
        {errorMessage && (<p className="text-red-600 italic text-sm">{errorMessage}</p>)}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/role-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewRole;
