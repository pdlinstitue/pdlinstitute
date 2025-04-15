"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";

interface NewCategoryProps {
  catName: string;
  createdBy?: string;
}

const AddNewCategory: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<NewCategoryProps>({
    catName: "",
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
    setIsSaving(true);
    setErrorMessage(""); // Clear the previous error    

    try {
      if (!data.catName.trim()) {
        setErrorMessage("Category name is required.");
      } else {
        const response = await fetch(`${BASE_API_URL}/api/categories`, {
          method: "POST",
          body: JSON.stringify({
            catName: data.catName,
            createdBy: loggedInUser.result?._id,
          }),
        });

        const post = await response.json();
        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push("/account/category-list");
        }
      }
    } catch (error) {
      toast.error("Error creating category.");
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
    <div className="flex justify-center items-center my-24">
      <form onSubmit={handleSubmit} className="formStyle w-[350px]">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Category Name:</label>
          <input
            type="text"
            className="inputBox"
            name="catName"
            value={data.catName}
            onChange={handleChange}
          />
        </div>
        {errorMessage && (
          <p className="text-red-600 italic text-sm">{errorMessage}</p>
        )}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/category-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCategory;