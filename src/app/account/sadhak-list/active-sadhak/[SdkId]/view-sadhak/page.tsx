"use client";
import React, { FormEvent, use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/app/account/Loading";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface ISadhakParams {
  params: Promise<{
    SdkId: string;
  }>;
}
interface ViewSadhakProps {
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkFthName: string;
  sdkMthName: string;
  sdkAbout: string;
  isMedIssue: string;
  sdkMedIssue: string;
  sdkBthDate: string;
  sdkGender: string;
  sdkMarStts: string;
  sdkSpouce: string;
  sdkCountry: string;
  sdkState: string;
  sdkCity: string;
  sdkPhone: string;
  sdkWhtNbr: string;
  sdkEmail: string;
  sdkComAdds: string;
  sdkParAdds: string;
  sdkImg: string;
  sdkRole: string;
  updatedBy: string;
}

interface countryListProps {
  country_id: string;
  country_name: string;
}

interface stateListProps {
  state_id: string;
  state_name: string;
}

interface cityListProps {
  city_id: string;
  city_name: string;
}

const ViewSadhak: React.FC<ISadhakParams> = ({ params }) => {
  const router = useRouter();
  const { SdkId } = use(params);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countryList, setCountryList] = useState<countryListProps[] | null>([]);
  const [stateList, setStateList] = useState<stateListProps[] | null>([]);
  const [cityList, setCityList] = useState<cityListProps[] | null>([]);
  const [sdkData, setSdkData] = useState<ViewSadhakProps>({
    sdkFstName: "",
    sdkMdlName: "",
    sdkLstName: "",
    sdkFthName: "",
    sdkMthName: "",
    sdkAbout: "",
    isMedIssue: "",
    sdkMedIssue: "",
    sdkBthDate: "",
    sdkGender: "",
    sdkMarStts: "",
    sdkSpouce: "",
    sdkPhone: "",
    sdkWhtNbr: "",
    sdkEmail: "",
    sdkCountry: "",
    sdkState: "",
    sdkCity: "",
    sdkComAdds: "",
    sdkParAdds: "",
    sdkImg: "",
    sdkRole: "",
    updatedBy: "",
  });

  useEffect(() => {
    async function fetchSdkById() {
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/users/${SdkId}/view-sadhak`,
          { cache: "no-store" }
        );
        const sadhakData = await res.json();
        setSdkData(sadhakData.sdkById);
      } catch (error) {
        console.error("Error fetching sadhak data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSdkById();
  }, []);

  useEffect(() => {
    async function fetchCountryList() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/countries`);
        const countryData = await res.json();
        setCountryList(countryData.ctrList);
      } catch (error) {
        console.error("Error fetching country data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCountryList();
  }, []);

  useEffect(() => {
    async function fetchStateList() {
      try {
        if (sdkData.sdkCountry) {
          const res = await fetch(
            `${BASE_API_URL}/api/states?country_id=${sdkData.sdkCountry}`
          );
          const stateData = await res.json();
          setStateList(stateData.sttList);
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStateList();
  }, [sdkData.sdkCountry]);

  useEffect(() => {
    async function fetchCityList() {
      try {
        if (sdkData.sdkState) {
          const res = await fetch(
            `${BASE_API_URL}/api/cities?state_id=${sdkData.sdkState}`
          );
          const cityData = await res.json();
          setCityList(cityData.cityList);
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCityList();
  }, [sdkData.sdkState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setSdkData((prevData) => (
      { ...prevData, [name]: value }
    ));
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <form className="flex flex-col gap-4 h-auto border-[1.5px] border-orange-500 p-9 rounded-md">
        <div className="grid grid-cols-2 gap-6">
          <div className="w-full h-auto border-[1.5px] bg-gray-100 ">
            <Image
              src={sdkData.sdkImg || "/images/sadhak.jpg"}
              alt="sadhak"
              width={600}
              height={350}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg">First Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkFstName"
                  value={sdkData.sdkFstName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Middle Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkMdlName"
                  value={sdkData.sdkMdlName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Last Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkLstName"
                  value={sdkData.sdkLstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Father's Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkFthName"
                  value={sdkData.sdkFthName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Mother's Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkMthName"
                  value={sdkData.sdkMthName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Birth Date:</label>
                <input
                  type="date"
                  className="inputBox"
                  name="sdkBthDate"
                  value={
                    sdkData.sdkBthDate
                      ? new Date(sdkData.sdkBthDate)
                          .toISOString()
                          .substring(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Phone:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkPhone"
                  value={sdkData.sdkPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">WhatsApp:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkWhtNbr"
                  value={sdkData.sdkWhtNbr}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">About:</label>
              <textarea
                rows={3}
                className="inputBox"
                name="sdkAbout"
                value={sdkData.sdkAbout}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Gender:</label>
            <select
              className="inputBox"
              name="sdkGender"
              value={sdkData.sdkGender}
              onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Email:</label>
            <input
              type="email"
              className="inputBox"
              name="sdkEmail"
              value={sdkData.sdkEmail}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Marital Status:</label>
            <select
              className="inputBox"
              name="sdkMarStts"
              value={sdkData.sdkMarStts}
              onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Spouce Name:</label>
            <input
              type="text"
              className="inputBox"
              name="sdkSpouce"
              value={sdkData.sdkSpouce}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Country:</label>
            <select
              className="inputBox"
              name="sdkCountry"
              value={sdkData.sdkCountry}
              onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              {countryList?.map((ctr: any) => {
                return (
                  <option key={ctr.country_id} value={ctr.country_id}>
                    {ctr.country_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">State:</label>
            <select
              className="inputBox"
              name="sdkState"
              value={sdkData.sdkState}
              onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              {stateList?.map((stt: any) => {
                return (
                  <option key={stt.state_id} value={stt.state_id}>
                    {stt.state_name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">City:</label>
            <select
              className="inputBox"
              name="sdkCity"
              value={sdkData.sdkCity}
              onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              {cityList?.map((cty: any) => {
                return (
                  <option key={cty.city_id} value={cty.city_id}>
                    {cty.city_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Role:</label>
            <select
              className="inputBox"
              name="sdkRole"
              value={sdkData.sdkRole}
              onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              <option value="Admin">Admin</option>
              <option value="Sadhak">Sadhak</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Permanent Address:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="sdkParAdds"
              value={sdkData.sdkParAdds}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Current Address:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="sdkComAdds"
              value={sdkData.sdkComAdds}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Do you have any medical issues?</label>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isMedIssue"
                  value="Yes"
                  checked={sdkData.isMedIssue === "Yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isMedIssue"
                  value="No"
                  checked={sdkData.isMedIssue !== "Yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>
        {
          sdkData.isMedIssue === "Yes" && (
            <div className="flex flex-col gap-2">
              <label className="text-lg">Medical Issues:</label>
              <textarea
                rows={3}
                className="inputBox"
                name="sdkMedIssue"
                value={sdkData.sdkMedIssue}
                onChange={handleChange}
              />
            </div>
          )
        }
        <div className="flex flex-col gap-2">
          <h2 className="text-lg text-center p-3 bg-gray-200 rounded-md font-semibold uppercase">
            List of Courses Done
          </h2>
          <p>BSK 1</p>
          <p>GK 1</p>
        </div>
        {errorMessage && (<p className="text-sm italic text-red-600">{errorMessage}</p>)}
        <div className="grid grid-cols-1 gap-1">
          <button
            type="button"
            className="btnLeft"
            onClick={() => router.push("/account/sadhak-list/active-sadhak")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default ViewSadhak;
