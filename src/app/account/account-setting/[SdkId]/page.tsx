"use client";
import Loading from "../../Loading";
import { BASE_API_URL } from "@/app/utils/constant";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface AccountSettingProps {
  _id?: string;
  sdkPhone: string;
  sdkWhtNbr: string;
  sdkEmail: string;
  updatedBy?: string;
}

interface IAccountParams {
  params: Promise<{
    SdkId: string;
  }>;
}

const AccountSetting: React.FC<IAccountParams> = ({ params }) => {

  const router = useRouter();
  const { SdkId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [contactDetails, setContactDetails] = useState<AccountSettingProps>({
    sdkPhone: "",
    sdkWhtNbr: "",
    sdkEmail: "",
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
    setContactDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {

    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(""); // Clear the previous error
    
    try {
      if (!contactDetails.sdkPhone.trim()) {
        setErrorMessage("Phone is required.");
      } else if (!contactDetails.sdkWhtNbr.trim()) {
        setErrorMessage("Whatsapp number is required.");
      } else if (!contactDetails.sdkEmail.trim()) {
        setErrorMessage("Email is required.");
      } else {
        const response = await fetch(
          `${BASE_API_URL}/api/users/${SdkId}/update-contact`,
          {
            method: "PUT",
            body: JSON.stringify({
              sdkPhone: contactDetails.sdkPhone,
              sdkWhtNbr: contactDetails.sdkWhtNbr,
              sdkEmail: contactDetails.sdkEmail,
              updatedBy: loggedInUser.result._id,
            }),
          }
        );
        const post = await response.json();
        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          if(loggedInUser.result.usrRole === "Admin" || loggedInUser.result.usrRole === "View-Admin"){
            router.push("/account/admin-dashboard");
          } else {
            router.push("/account/sadhak-dashboard");
          }
        }
      }
    } catch (error) {
        toast.error("Error updating contact details.");
    } finally {
        setIsSaving(true);
      }
    };

  useEffect(() => {
    async function fetchContactDetails() {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/users/${SdkId}/view-sadhak`,
          { cache: "no-store" }
        );
        const data = await response.json();
        setContactDetails(data?.sdkById);
      } catch (error) {
        console.error("Error fetching contact details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContactDetails();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center my-24">
      <form className="formStyle w-[400px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label>Phone:</label>
          <input
            type="text"
            className="inputBox"
            name="sdkPhone"
            value={contactDetails.sdkPhone}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>WhatsApp:</label>
          <input
            type="text"
            className="inputBox"
            name="sdkWhtNbr"
            value={contactDetails.sdkWhtNbr}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Email:</label>
          <input
            type="email"
            className="inputBox"
            name="sdkEmail"
            value={contactDetails.sdkEmail}
            onChange={handleChange}
          />
        </div>
        {errorMessage && (
          <p className="text-sm italic text-red-600">{errorMessage}</p>
        )}
        <div className="grid grid-cols-2 gap-1">
          <button type="submit" className="btnLeft" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight"
            onClick={() => {
              if (loggedInUser.result.usrRole === "Sadhak") {
                router.push("/account/sadhak-dashboard");
              } else {
                router.push("/account/admin-dashboard");
              }
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSetting;
