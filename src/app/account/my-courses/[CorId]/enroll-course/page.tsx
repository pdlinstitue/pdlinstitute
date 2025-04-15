"use client";
import Loading from "@/app/account/Loading";
import React, { FormEvent, use, useEffect, useState } from "react";
import { BASE_API_URL } from "@/app/utils/constant";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import NoBatch from "@/app/components/NoBatch";
import Image from "next/image";

interface IEnrollCourseParams {
  params: Promise<{
    CorId: string;
  }>;
}

interface BatchListProps {
  _id: string;
  bthName: string;
}

interface BatchDataProps {
  enrTnsNo: string;
  cpnName?: string;
  enrSrnShot: string;
  corId: string;
  bthId: string;
  sdkId: string;
  createdBy?: string;
}

interface CorDataProps {
  coDon: number;
  coType: string;
  coDisc: number;
}

const EnrollCourse: React.FC<IEnrollCourseParams> = ({ params }) => {

  const { CorId } = use(params);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [payThrough, setPaythrough] = useState<string>("");
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const[isCoupanApplied, setIsCoupanApplied]=useState<boolean>(false);
  const [amtAfterCoupon, setAmtAfterCoupon] = useState<number>(0);
  const [isScreeshotSelected, setIsScreeshotSelected] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [corData, setCorData] = useState<CorDataProps>({
    coDon: 0,
    coDisc: 0,
    coType: "",
  });
  const [enrData, setEnrData] = useState<BatchDataProps>({
    enrSrnShot: "",
    cpnName: "",
    enrTnsNo: "",
    corId: "",
    bthId: "",
    sdkId: "",
    createdBy: "",
  });

  const [bthData, setBthData] = useState<{ [key: string]: string }>({
    id: "",
    bthBank: "",
    bthQr: "",
  });
  
  const [batchList, setBatchList] = useState<BatchListProps[] | null>([]);
  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setEnrData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setIsScreeshotSelected(true);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image!");
      return;
    }
   
    setIsUploading(true);
    const formData = new FormData();
    formData.append("paymentImage", image);

    try {
      const res = await fetch("/api/payment-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Screenshot uploaded.");
        setImage(data.imageUrl);
        setIsUploaded(true);
      } else {
        setIsUploaded(false);
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      setIsUploaded(false);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAmtAfterCoupon = async () => {
    if (!enrData.cpnName?.trim()) {
      setErrorMessage("Please enter a coupon code.");
    } else {
      try {
        const response = await fetch(`${BASE_API_URL}/api/apply-coupon`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cpnName: enrData.cpnName,
            appliedBy: loggedInUser.result?._id,
            corId: CorId,
          }),
        });

        const result = await response.json();

        if (result.success === true) {
          const discount =
            result.cpnDisType === "Percentage"
              ? (corData.coDon * result.cpnDisc) / 100
              : result.cpnDisc;

          setAmtAfterCoupon(Math.max(0, corData.coDon - discount));
          setIsCoupanApplied(true);
          toast.success(result.msg);
        } else {
          toast.error(result.msg);
        }
      } catch (error) {
        console.error("Error applying coupon:", error);
        toast.error("Error applying coupon.");
      }
    }
  };

  const handlePayThrough = (item: any) => {
    if (item === "QR") {
      setPaythrough("QR");
    } else {
      setPaythrough("CCA");
    }
  };

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

  useEffect(() => {
    async function fetchBatchesByCoId() {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/my-courses/${CorId}/view-batch?sdkId=${loggedInUser.result?._id}&excl=true`
        );
        const data = await response.json();
        setBatchList(data.bthListByCourseId);
      } catch (error) {
        console.error("Error fetching batches by course id: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBatchesByCoId();
  }, [loggedInUser]);

  useEffect(() => {
    async function fetchBatchDataById() {
      if (enrData.bthId) {
        try {
          const res = await fetch(
            `${BASE_API_URL}/api/batches/${enrData.bthId}/view-batch`
          );
          const bthDetails = await res.json();
          setBthData(bthDetails.bthById);
        } catch (error) {
          console.error("Error fetching bthData by id: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchBatchDataById();
  }, [enrData.bthId]);

  useEffect(() => {
    async function fetchCourseById() {
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/courses/${CorId}/view-course`
        );
        const courseData = await res.json();
        setCorData(courseData.corById);
      } catch (error) {
        console.error("Error fetching corData by id: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseById();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!payThrough.trim()) {
      setErrorMessage("Please select payment method.");
      return;
    }

    if (payThrough === "QR" && !enrData.enrTnsNo.trim()) {
      setErrorMessage("Please enter transaction number.");
      return;
    }

    if(payThrough === "QR" && (!isScreeshotSelected || (isScreeshotSelected && !isUploaded))) {
      setErrorMessage("Please upload payment screenshot.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/enrollments`, {
        method: "POST",
        body: JSON.stringify({
          enrTnsNo: enrData.enrTnsNo,
          enrSrnShot: image,
          cpnName: enrData.cpnName,
          bthId: enrData.bthId,
          corId: CorId,
          sdkId: loggedInUser.result._id,
          createdBy: loggedInUser.result._id
        }),
      });

      const post = await response.json();

      if (post.success === false) {
        toast.error(post.msg);
      } else {
        if (payThrough === "CCA") {
          handlePayment(post.savedEnr._id);
        } else {
          toast.success(post.msg);
          router.push("/account/my-courses/elg-courses");
        }
      }
    } catch (error) {
      toast.error("Error enrolling batch.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayment = async (enrId: any) => {
    const response = await fetch(`/api/payment?enrId=${enrId}&corId=${CorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: `ORD${Date.now()}`,
        amount: isCoupanApplied?amtAfterCoupon:corData.coDon,
        customer_email: "test@example.com",
        customer_phone: "9876543210",
      }),
    });

    const data = await response.json();

    if (data.encryptedData) {
      // Create form & submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const encInput = document.createElement("input");
      encInput.type = "hidden";
      encInput.name = "encRequest";
      encInput.value = data.encryptedData;
      form.appendChild(encInput);

      const accessInput = document.createElement("input");
      accessInput.type = "hidden";
      accessInput.name = "access_code";
      accessInput.value = data.accessCode;
      form.appendChild(accessInput);

      document.body.appendChild(form);
      form.submit();
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
    <div>
      <div>
        {!batchList ? (
          <NoBatch CourseId={CorId} />
        ) : (          
          <form
            className="formStyle w-[600px] mx-auto my-24"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-center text-orange-600 italic">
                Enroll Batch
              </h1>
              <select
                className="inputBox"
                name="bthId"
                value={enrData.bthId}
                onChange={handleChange}
              >
                <option value="" className="text-center">
                  --- Select Batch ---
                </option>
                {batchList.map((bth: any) => (
                  <option key={bth._id} value={bth._id}>
                    {bth.bthName}
                  </option>
                ))}
              </select>
              {bthData.id !== "" && (
                <div className="flex flex-col gap-3">
                  <div className="flex p-2 bg-gray-200 items-center justify-center gap-4">
                    <span className="font-bold">DONATION:</span>
                    <p>{corData.coDon ? isCoupanApplied?amtAfterCoupon: corData.coDon : corData.coType}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">BANK DETAILS:</label>
                    <p>{bthData.bthBank}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">TRANSACTION NO.</label>
                    <input
                      type="text"
                      name="enrTnsNo"
                      value={enrData.enrTnsNo}
                      onChange={handleChange}
                      className="inputBox"
                      placeholder="Enter transaction no."
                    />
                  </div>
                  {preview && (
                    <div className="flex items-center justify-center gap-2">
                       <Image src={preview} alt="payment-screenshot" width={400} height={600} />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">UPLOAD SCREENSHOT</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        name="enrScnShot"
                        className="inputBox w-full"
                        onChange={handleFileChange}
                      />
                      <button type="button" className="btnLeft" onClick={handleUpload} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold uppercase">Coupon Code</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        name="cpnName"
                        value={enrData.cpnName}
                        onChange={handleChange}
                        className="inputBox w-full"
                        placeholder="Enter coupon code"
                      />
                      <button
                        type="button"
                        className="btnLeft"
                        onClick={handleAmtAfterCoupon}
                      >
                        APPLY
                      </button>
                    </div>
                    </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">PAY THROUGH</label>
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        name="payThrough"
                        onClick={() => handlePayThrough("QR")}
                      />
                      QR Code
                      <input
                        type="radio"
                        name="payThrough"
                        onClick={() => handlePayThrough("CCA")}
                      />
                      CCAvenue
                    </div>
                  </div>
                  {payThrough === "QR" && bthData.bthQr && (
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">QR CODE:</label>
                      <Image src={bthData.bthQr} alt="paymentQR" width={400} height={400} />
                    </div>
                  )}
                </div>
              )}
            </div>
            {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
            <div className="grid grid-cols-2 gap-1">
              <button type="submit" className="btnLeft" disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.push("/account/my-courses/elg-courses")}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnrollCourse;
