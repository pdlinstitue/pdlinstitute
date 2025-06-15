"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "../account/Loading";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
 
interface MyCourseDataProps {
    myCoData: any;
}

const CompletedCourse: React.FC <MyCourseDataProps> = ({myCoData}) => {
    
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        { myCoData?.map((cor: any) => (
          <div className="max-w-[400px]" key={cor._id}>
            <div className="flex flex-col bg-white rounded-md shadow-xl p-9 gap-1 border-[1.5px] border-orange-600">
              {cor.coImg ? (
                <Image
                  src={`/api/image-upload?name=${cor.coImg}`}
                  alt="courseImage"
                  width={320}
                  height={220}
                />
              ) : null}
              <h2 className="text-lg font-bold bg-gray-200 p-2 text-center">
                {cor.coName}
              </h2>
              <div className="flex justify-between text-sm gap-2">
                <p>
                  <span className="font-bold">Category:</span> {cor.coCat}
                </p>
                <p>
                  <span className="font-bold">Type:</span> {cor.coType}
                </p>
              </div>
              <div className="flex justify-between text-sm gap-2">
                <p className="text-sm">
                  <span className="font-bold">Duration:</span> {cor.durDays}{" "}
                  DAYS
                </p>
                <p className="text-sm">
                  <span className="font-bold">Min/-Day:</span> {cor.durHrs}
                </p>
              </div>
              <div className="flex justify-between text-sm gap-2">
                <p className="text-sm">
                  <span className="font-bold">Eligibility:</span>{" "}
                  {cor?.eligibilityName}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Fee: &#8377;</span>{" "}
                  {cor?.coDon?.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                className="btnRight"
                disabled={
                  cor.reqStatus === "Pending" ||
                  cor.reqStatus === "Rejected" ||
                  cor.reqStatus === "ReEnrolled"
                }
                onClick={() => {
                  if (cor.reqStatus === "Approved") {
                    router.push(
                      `/account/my-courses/${cor._id}/enroll-course?isReEnroll=true`
                    );
                  } else if (!cor.reqStatus || cor.reqStatus === "Rejected") {
                    router.push(
                      `/account/my-courses/${cor._id}/request-to-re-enroll`
                    );
                  }
                }}
              >
                {cor.reqStatus === "Pending"
                  ? "Requested"
                  : cor.reqStatus === "Approved"
                  ? "Re-enroll"
                  : cor.reqStatus === "ReEnrolled"
                  ? "Re-enrolled"
                  : "Request to Re-enroll"}
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <button
                  type="button"
                  className="btnLeft"
                  onClick={() =>
                    cor.gglFmLink && window.open(cor.gglFmLink, "_blank")
                  }
                >
                  Google Form
                </button>
                <button
                  type="button"
                  className="btnRight"
                  onClick={() =>
                    router.push(`/account/my-courses/${cor._id}/read-more`)
                  }
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCourse;