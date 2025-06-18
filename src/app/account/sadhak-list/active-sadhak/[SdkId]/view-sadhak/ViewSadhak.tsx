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

interface ViewSadhakItems {
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkEdc: string;
  sdkOcp: string;
  sdkFthName: string;
  sdkMthName: string;
  sdkAbout: string;
  isMedIssue: string;
  sdkMedIssue: string;
  sdkBthDate: string;
  sdkGender: string;
  sdkMarStts: string;
  sdkSpouce: string;
  sdkRefName: string;
  sdkRefCont: string;
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
  isVolunteer: string;
  isAdmin: string;
  updatedBy: string;
}

interface ViewSadhakProps {
    sdkData:ViewSadhakItems;
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

interface RoleListProps {
  _id: string;
  roleType: string;
}

const ViewSadhak: React.FC<ViewSadhakProps> = ({ sdkData }) => {

  const router = useRouter();
  const [roleList, setRoleList] = useState<RoleListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countryList, setCountryList] = useState<countryListProps[] | null>([]);
  const [stateList, setStateList] = useState<stateListProps[] | null>([]);
  const [cityList, setCityList] = useState<cityListProps[] | null>([]);
//   const [sdkData, setSdkData] = useState<ViewSadhakProps>({
//     sdkFstName: "",
//     sdkMdlName: "",
//     sdkLstName: "",
//     sdkEdc: "",
//     sdkOcp: "",
//     sdkFthName: "",
//     sdkMthName: "",
//     sdkAbout: "",
//     isMedIssue: "",
//     sdkMedIssue: "",
//     sdkBthDate: "",
//     sdkGender: "",
//     sdkMarStts: "",
//     sdkSpouce: "",
//     sdkRefName: "",
//     sdkRefCont: "",
//     sdkPhone: "",
//     sdkWhtNbr: "",
//     sdkEmail: "",
//     sdkCountry: "",
//     sdkState: "",
//     sdkCity: "",
//     sdkComAdds: "",
//     sdkParAdds: "",
//     sdkImg: "",
//     sdkRole: "",
//     isVolunteer: "",
//     isAdmin: "",
//     updatedBy: "",
//   });

  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    usrName: "",
    usrRole: "",
    isAdmin: "",
  });

  useEffect(() => {
  try {
    const cookie = Cookies.get("loggedInUser");
    if (cookie) {
        const parsed = JSON.parse(cookie);
        setLoggedInUser({
        id: parsed.id || "",
        usrName: parsed.usrName || "",
        usrRole: parsed.usrRole || "",
        isAdmin: parsed.isAdmin || "", 
      });
    }
  } catch (error) {
    console.error("Error parsing loggedInUser cookie:", error);
  } finally {
    setIsLoading(false);
    }
  }, []);

//   useEffect(() => {
//     async function fetchSdkById() {
//       try {
//         const res = await fetch(
//           `${BASE_API_URL}/api/users/${SdkId}/view-sadhak`,
//           { cache: "no-store" }
//         );
//         const sadhakData = await res.json();
//         setSdkData(sadhakData.sdkById);
//       } catch (error) {
//         console.error("Error fetching sadhak data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchSdkById();
//   }, []);

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
            `${BASE_API_URL}/api/states?country_name=${sdkData.sdkCountry}`
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
            `${BASE_API_URL}/api/cities?state_name=${sdkData.sdkState}`
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

  useEffect(() => {
    async function fetchRoleList() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/role-list`);
        const roleData = await res.json();
        let roleList =
          Cookies.get("loggedInUserRole") === "Admin"
            ? roleData?.rolList?.filter(
                (a: any) =>
                  a.roleType !== "Super-Admin" && a.roleType !== "Admin"
              )
            : roleData?.rolList;
        setRoleList(roleList);
      } catch (error) {
        console.error("Error fetching role data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoleList();
  }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
//     const { name, value } = e.target;
//     setSdkData((prevData) => (
//         { ...prevData, [name]: value }
//     ));
//   };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <form className="formStyle w-full" >
        <div className="md:flex gap-8 w-auto">
          <div className="flex flex-col gap-1 w-auto h-auto">
            <div className="w-[400px] h-[345px] border-[1.5px] bg-gray-100">
              {sdkData.sdkImg ? (
                <Image
                  src={`/api/profile-upload?name=${sdkData?.sdkImg}`}
                  alt="Profile Preview"
                  width={400}
                  height={345}
                  className="w-full h-full object-cover"
                />
              ) : (<div className="flex justify-center items-center w-[400px] h-[388px] border-[1.5px] bg-gray-100">
                No Image
              </div>)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg">First Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkFstName"
                  defaultValue={sdkData.sdkFstName}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Middle Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkMdlName"
                  defaultValue={sdkData.sdkMdlName}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Last Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkLstName"
                  defaultValue={sdkData.sdkLstName}
                //   onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Father Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkFthName"
                  defaultValue={sdkData.sdkFthName}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Mother's Name:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkMthName"
                  defaultValue={sdkData.sdkMthName}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Birth Date:</label>
                <input
                  type="date"
                  className="inputBox"
                  name="sdkBthDate"
                  defaultValue={sdkData.sdkBthDate}
                //   onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg">Education:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkEdc"
                  defaultValue={sdkData.sdkEdc}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Occupation:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkOcp"
                  defaultValue={sdkData.sdkOcp}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">Phone:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkPhone"
                  defaultValue={sdkData.sdkPhone}
                //   onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg">WhatsApp:</label>
                <input
                  type="text"
                  className="inputBox"
                  name="sdkWhtNbr"
                  defaultValue={sdkData.sdkWhtNbr}
                //   onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">About:</label>
              <textarea
                rows={3}
                className="inputBox"
                name="sdkAbout"
                defaultValue={sdkData.sdkAbout}
                // onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Gender:</label>
            <select
              className="inputBox"
              name="sdkGender"
              defaultValue={sdkData.sdkGender}
            //   onChange={handleChange}
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
              defaultValue={sdkData.sdkEmail}
            //   onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Marital Status:</label>
            <select
              className="inputBox"
              name="sdkMarStts"
              defaultValue={sdkData.sdkMarStts}
            //   onChange={handleChange}
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
              defaultValue={sdkData.sdkSpouce}
            //   onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Referer Name:</label>
            <input
              className="inputBox"
              name="sdkRefName"
              defaultValue={sdkData?.sdkRefName}
            //   onChange={handleChange}
            >
            </input>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Referer Phone:</label>
            <input
              type="number"
              className="inputBox"
              name="sdkRefCont"
              defaultValue={sdkData?.sdkRefCont}
            //   onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Country:</label>
            <select
              className="inputBox"
              name="sdkCountry"
              value={sdkData.sdkCountry}
              disabled
            //   onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              {countryList?.map((ctr: any) => {
                return (
                  <option key={ctr.country_id} value={ctr.country_name}>
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
              disabled
            //   onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              {stateList?.map((stt: any) => {
                return (
                  <option key={stt.state_id} value={stt.state_name}>
                    {stt.state_name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">City:</label>
            <select
              className="inputBox"
              name="sdkCity"
              value={sdkData.sdkCity}
              disabled
            //   onChange={handleChange}
            >
              <option className="text-center"> --- Select --- </option>
              {cityList?.map((cty: any) => {
                return (
                  <option key={cty.city_id} value={cty.city_name}>
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
              disabled
            //   onChange={handleChange}
            >
              <option className="text-center"> --- Select Role --- </option>
              {roleList?.map((item: any) => {
                return (
                  <option key={item._id} value={item.roleType}>
                    {item.roleType}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Permanent Address:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="sdkParAdds"
              defaultValue={sdkData.sdkParAdds}
            //   onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Current Address:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="sdkComAdds"
              defaultValue={sdkData.sdkComAdds}
            //   onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Do you have any medical issues?</label>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isMedIssue"
                  defaultValue="Yes"
                  defaultChecked={sdkData.isMedIssue === "Yes"}
                //   onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isMedIssue"
                  defaultValue="No"
                  defaultChecked={sdkData.isMedIssue === "No"}
                //   onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          {loggedInUser.usrRole === "Super-Admin" && (
            <div className="flex flex-col gap-2">
              <label className="text-lg">Is Admin?</label>
              <div className="flex gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isAdmin"
                    defaultValue="Yes"
                    defaultChecked={sdkData.isAdmin === "Yes"}
                    // onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isAdmin"
                    defaultValue="No"
                    defaultChecked={sdkData.isAdmin === "No"}
                    // onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-lg">Is Volunteer?</label>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isVolunteer"
                  defaultValue="Yes"
                  defaultChecked={sdkData.isVolunteer === "Yes"}
                //   onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isVolunteer"
                  defaultValue="No"
                  defaultChecked={sdkData.isVolunteer !== "Yes"}
                //   onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>
        {sdkData.isMedIssue === "Yes" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Medical Issues:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="sdkMedIssue"
              defaultValue={sdkData.sdkMedIssue}
            //   onChange={handleChange}
            />
          </div>
        )}
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
