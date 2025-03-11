"use client";
import React, { use, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";

interface IBthParams {
  params: Promise<{
    BthId?: string;
  }>;
}

interface CoListProps {
  _id: string;
  coNick: string;
  coName: string;
}

const EditBatch: React.FC<IBthParams> = ({ params }) => {
  const router = useRouter();
  const { BthId } = use(params); // Fix: Directly destructure params

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [batchTitle, setBatchTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [coList, setCoList] = useState<CoListProps[]>([]);
  const [data, setData] = useState({
    bthName: "",
    bthShift: "",
    bthStart: "",
    bthEnd: "",
    corId: "",
    bthVtr: "",
    bthWhatGrp: "",
    bthTeleGrp: "",
    bthLang: "",
    bthMode: "",
    bthLink: "",
    bthLoc: "",
    bthBank: "",
    bthQr: "",
    updatedBy: "",
  });

  const loggedInUserId = Cookies.get("loggedInUserId") || "";
  const loggedInUser = {
    _id: loggedInUserId,
  };

  useEffect(() => {
    if (data.bthLang && data.corId && data.bthStart && data.bthShift) {
      const course = coList.find((item) => item._id === data.corId);
      if (course) {
        setBatchTitle(`${course.coNick}-${data.bthLang}-${data.bthShift}-${data.bthStart}`);
      }
    }
  }, [data.corId, data.bthStart, data.bthShift, data.bthLang, coList]);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, { cache: "no-store" });
        const coData = await res.json();
        setCoList(coData.coList);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (!BthId) return; // Fix: Avoid unnecessary fetch when BthId is undefined

    async function fetchBatchById() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/batches/${BthId}/view-batch`, { cache: "no-store" });
        const batchData = await res.json();
        setData(batchData.bthById);
        setBatchTitle(batchData.bthById.bthName);
      } catch (error) {
        console.error("Error fetching batch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBatchById();
  }, [BthId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("qrImage", image);
    formData.append("qrImageFileName", data.bthQr);

    try {
      const res = await fetch("/api/qr-upload", { method: "POST", body: formData });
      const responseData = await res.json();

      if (responseData.success) {
        toast.success("QR uploaded successfully!");
        setData((prev) => ({ ...prev, bthQr: responseData.imageUrl }));
      } else {
        throw new Error(responseData.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!data.bthShift) return setErrorMessage("Please select shift.");
    if (!data.corId) return setErrorMessage("Please select course.");
    if (!data.bthMode) return setErrorMessage("Please select mode.");
    if (!data.bthLang) return setErrorMessage("Please select language.");
    if (data.bthMode === "Online" && !data.bthLink) return setErrorMessage("Please provide meeting link.");
    if (data.bthMode !== "Online" && !data.bthLoc) return setErrorMessage("Please provide location details.");

    try {
      const response = await fetch(`${BASE_API_URL}/api/batches/${BthId}/edit-batch`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          bthName: batchTitle,
          updatedBy: loggedInUser._id,
        }),
      });

      const post = await response.json();
      if (!post.success) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/batch-list");
      }
    } catch (error) {
      toast.error("Error updating batch.");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <form
        className="formStyle w-full"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Batch Title:</label>
              <input
                type="text"
                className="inputBox"
                name="bthName"
                value={batchTitle}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Batch Shift:</label>
              <select
                className="inputBox"
                name="bthShift"
                value={data.bthShift}
                onChange={handleChange}
              >
                <option className="text-center">--- Select Shift ---</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Course:</label>
              <select
                className="inputBox"
                name="corId"
                value={data.corId}
                onChange={handleChange}
              >
                <option className="text-center">--- Select Course ---</option>
                {coList?.map((item: any) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.coName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Volunteer:</label>
              <select
                className="inputBox"
                name="bthVtr"
                value={data.bthVtr}
                onChange={handleChange}
              >
                <option className="text-center">
                  --- Assign Volunteer ---
                </option>
                <option value="Basic Education - 1">Free</option>
                <option value="Basic Education - 2">Donation</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Start Date:</label>
              <input
                type="date"
                className="inputBox"
                name="bthStart"
                //value={data?.bthStart}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">End Date</label>
              <input
                type="date"
                className="inputBox"
                name="bthEnd"
                //value={data?.bthEnd}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">WhatsApp group:</label>
              <input
                type="text"
                className="inputBox"
                name="bthWhatGrp"
                value={data.bthWhatGrp}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Telegram group:</label>
              <input
                type="text"
                className="inputBox"
                name="bthTeleGrp"
                value={data.bthTeleGrp}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg">Mode Of Batch:</label>
            <select
              className="inputBox"
              name="bthMode"
              value={data.bthMode}
              onChange={handleChange}
            >
              <option className="text-center">--- Select Mode ---</option>
              <option value="Online">Online</option>
              <option value="Offline without accommodation">
                Offline without accommodation
              </option>
              <option value="Offline with accommodation">
                Offline with accommodation
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg">Language:</label>
            <select
              className="inputBox"
              name="bthLang"
              value={data.bthLang}
              onChange={handleChange}
            >
              <option className="text-center">--- Select Language ---</option>
              <option value="ENG">English</option>
              <option value="HIN">Hindi</option>
            </select>
          </div>
        </div>
        {data.bthMode === "Online" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Meeting Link:</label>
            <input
              type="text"
              className="inputBox"
              name="bthLink"
              value={data.bthLink}
              onChange={handleChange}
            />
          </div>
        )}
        {data.bthMode === "Offline with accommodation" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Location:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="bthLoc"
              value={data.bthLoc}
              onChange={handleChange}
            />
          </div>
        )}
        {data.bthMode === "Offline without accommodation" && (
          <div className="flex flex-col gap-2">
            <label className="text-lg">Location:</label>
            <textarea
              rows={3}
              className="inputBox"
              name="bthLoc"
              value={data.bthLoc}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label>Bank Details</label>
            <textarea
              rows={3}
              className="inputBox"
              name="bthBank"
              value={data.bthBank}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative w-full h-auto border-[1.5px] bg-gray-100 flex items-center justify-center">
              {!preview && (
                <span className="absolute font-bold text-center">QR CODE</span>
              )}
              <Image
                src={preview || data.bthQr}
                alt="qr-code"
                width={400}
                height={400}
              />
            </div>
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*"
                className="inputBox w-full h-[45px]"
                onChange={handleFileChange}
              ></input>
              <button type="button" className="btnLeft" onClick={handleUpload}>
                UPLOAD
              </button>
            </div>
          </div>
        </div>
        {errorMessage && (
          <p className="text-sm text-red-600 italic">{errorMessage}</p>
        )}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/batch-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditBatch;