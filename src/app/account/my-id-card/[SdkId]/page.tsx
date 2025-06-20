"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Loading from '../../Loading';
import { format } from 'date-fns';
import { FaUserCircle } from 'react-icons/fa';

interface IDCardParams {
  params: Promise<{
    SdkId: string;
  }>;
}

interface MyIDCardProps {
  sdkRegNo: string;
  sdkFstName: string;
  sdkMidName: string;
  sdkLstName: string;
  sdkRole: string;
  sdkImg: string;
  sdkBthDate: string;
  sdkCountry: string;
  sdkState: string;
  sdkCity: string;
}

const MyIDCard: React.FC<IDCardParams> = ({ params }) => {

  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myIDCard, setMyIDCard] = useState<MyIDCardProps>({
    sdkRegNo: '',
    sdkFstName: '',
    sdkMidName: '',
    sdkLstName: '',
    sdkRole: '',
    sdkImg: '',
    sdkBthDate: '',
    sdkCountry: '',
    sdkState: '',
    sdkCity: ''
  });

  let loggedInUser = { id: "", usrName: "", usrRole: "", isAdmin: "" };
  const cookie = Cookies.get("loggedInUser");
  if (cookie) {
    const parsed = JSON.parse(cookie);
    loggedInUser = {
      id: parsed.id || "",
      usrName: parsed.usrName || "",
      usrRole: parsed.usrRole || "",
      isAdmin: parsed.isAdmin || "",
    };
  }

  useEffect(() => {
    async function fetchUserProfileById() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/${loggedInUser.id}/view-sadhak`);
        const userData = await res.json();
        const sdkData = userData.sdkById;
        const formattedDate = sdkData?.sdkBthDate
          ? format(new Date(sdkData.sdkBthDate), 'dd, MMM, yyyy').toUpperCase()
          : '';
  
        setMyIDCard({
          ...sdkData,
          sdkBthDate: formattedDate,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserProfileById();
  }, []);  

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center print-content">
      <div className="formStyle w-auto  my-24">
        <div className="flex flex-col items-center justify-center p-3  bg-gray-100 rounded-lg">
          <Image
            src="/images/pdlLogo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h1 className="text-lg font-bold uppercase">PDL INSTITUTE</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="flex justify-center items-center  bg-gray-100 rounded-lg p-4">
            {myIDCard.sdkImg ? (
              <Image
                src={`/api/profile-upload?name=${myIDCard.sdkImg}`}
                className="rounded-full"
                width={160}
                height={160}
                alt="sdkImg"
              />
            ) : (
              <FaUserCircle className="text-gray-400 w-[160px] h-[160px] cursor-pointer" />
            )}
          </div>
          <div className="flex flex-col gap-1 bg-gray-100 rounded-lg p-3">
            <h1 className="text-2xl font-bold uppercase">
              {myIDCard.sdkFstName} {myIDCard.sdkMidName} {myIDCard.sdkLstName}
            </h1>
            <p className="text-sm">
              <span className="pr-2 font-semibold">ROLE:</span>
              {myIDCard.sdkRole}
            </p>
            <p className="text-sm ">
              <span className="pr-2 font-semibold">SDK ID:</span>
              {myIDCard.sdkRegNo}
            </p>
            <p className="text-sm ">
              <span className="pr-2 font-semibold">DOB:</span>
              {myIDCard.sdkBthDate}
            </p>
            <p className="text-sm ">
              <span className="pr-2 font-semibold">LOCATION:</span>
              {myIDCard.sdkCity}, {myIDCard.sdkState}
            </p>
            <p className="text-sm ">
              <span className="pr-2 font-semibold">COUNTRY:</span>
              {myIDCard.sdkCountry}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center bg-gray-100 rounded-lg p-2">
          <h1 className="text-sm italic">https://www.pdlinstitute.org</h1>
        </div>
        <div className="flex flex-col gap-1 print:hidden">
          <button
            type="button"
            className="btnRight"
            disabled={isSaving}
            onClick={() => {
              setIsSaving(true);
              window.print();
              setTimeout(() => setIsSaving(false), 1000); // brief delay to allow reset
            }}
          >
            {isSaving ? "Printing..." : "Print"}
          </button>
          <button
            type="button"
            className="btnLeft"
            onClick={() => {
              if (
                loggedInUser.usrRole === "Super-Admin" ||
                loggedInUser.usrRole === "Admin" ||
                loggedInUser.usrRole === "View-Admin"
              ) {
                router.push("/account/admin-dashboard");
              } else {
                router.push("/account/sadhak-dashboard");
              }
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyIDCard;
