"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";
import Loading from "../Loading";

interface AddNewAdsProps {
  sdkDocType: string;
  sdkDocOwnr: string;
  sdkUpldDate: Date;
  sdkDocRel: string;
  sdkAdsProof: string;
  sdkAdsNbr: string;
  createdBy?: string;
}

const AddNewAds: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AddNewAdsProps>({
    sdkDocType: "",
    sdkDocOwnr: "",
    sdkUpldDate: new Date(),
    sdkDocRel: "",
    sdkAdsProof: "",
    sdkAdsNbr: "",
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
    try {
      const response = await fetch(`${BASE_API_URL}/api/documents`, {
        method: "POST",
        body: JSON.stringify({
          sdkDocType: "Ads",
          sdkDocOwnr: data.sdkDocOwnr,
          sdkUpldDate: new Date(),
          sdkAdsNbr: data.sdkAdsNbr,
          sdkDocRel: data.sdkDocRel,
          sdkAdsProof: data.sdkAdsProof,
          createdBy: loggedInUser.result._id,
        }),
      });

      const post = await response.json();
      console.log(post);

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/doc-list/ads-card");
      }
    } catch (error) {
      toast.error("Error uploading document.");
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
    <div className="flex justify-center items-center my-8">
      <form className="formStyle w-[600px]" onSubmit={handleSubmit}>
        <div className="grid grid-rows-4 gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Card Number:</label>
            <input
              type="text"
              className="inputBox"
              name="sdkAdsNbr"
              value={data.sdkAdsNbr}
              onChange={handleChange}
              placeholder="Enter card number"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Owner Name:</label>
            <input
              className="inputBox"
              name="sdkDocOwnr"
              value={data.sdkDocOwnr}
              placeholder="Enter the name of card owner"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Relation:</label>
            <input
              className="inputBox"
              name="sdkDocRel"
              value={data.sdkDocRel}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Upload Image:</label>
            <div className="flex gap-1">
              <input
                type="file"
                className="inputBox w-full"
                name="sdkAdsProof"
                value={data.sdkAdsProof}
                onChange={handleChange}
              />
              <button type="button" className="btnRight">
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full mt-3">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/doc-list/id-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewAds;
