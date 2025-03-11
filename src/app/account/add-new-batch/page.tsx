"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface VolunteerListProps {
  _id: string;
  sdkFstName: string;
}
interface AddNewBatchProps {
  bthName: string;
  bthShift: string;
  bthStart: string;
  bthEnd: string;
  corId: string;
  bthVtr: string;
  bthWhatGrp: string;
  bthTeleGrp: string;
  bthLang: string;
  bthMode: string;
  bthLink: string;
  bthLoc: string;
  bthBank: string;
  bthQr: string;
  createdBy: string;
}
const AddNewBatch: React.FC = () => {
  const router = useRouter();
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState<AddNewBatchProps>({
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
    createdBy: "",
  });
  const [volunteer, setVolunteer] = useState<VolunteerListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loggedInUser = {
    result: {
      _id: Cookies.get("loggedInUserId"),
      usrName: Cookies.get("loggedInUserName"),
      usrRole: Cookies.get("loggedInUserRole"),
    },
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [coList, setCoList] = useState<
    { _id: string; coNick: string; coName: string }[] | null
  >([]);
  const [batchTitle, setBatchTitle] = useState("");

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

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
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

    try {
      const res = await fetch("/api/qr-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("QR uploaded successfully!");
        setImage(data.imageUrl);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const updateBatchTitle = () => {
      if (data.bthLang && data.corId && data.bthStart && data.bthShift) {
        const cor = coList?.filter((item: any) => item._id === data.corId);
        if (cor && cor.length > 0) {
          const bthStartDate = new Date(data.bthStart);
          const formattedBthStart = format(bthStartDate, "MMM do, yyyy");
          setBatchTitle(
            `${cor[0]?.coNick}_${data.bthLang}_${data.bthShift}_${formattedBthStart}`
          );
        } else {
          setBatchTitle("");
        }
      } else {
        setBatchTitle("");
      }
    };
    updateBatchTitle();
  }, [data.corId, data.bthStart, data.bthShift, data.bthLang]);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, {
          cache: "no-store",
        });
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
    async function fetchVolUsers() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/volunteers`, {
          cache: "no-store",
        });
        const volUserData = await res.json();
        setVolunteer(volUserData.volList);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVolUsers();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(""); // Clear the previous error

    if (!data.bthShift.trim()) {
      setErrorMessage("Please select shift.");
    } else if (!data.corId.trim()) {
      setErrorMessage("Please select course.");
    } else if (!data.bthMode.trim()) {
      setErrorMessage("Please select mode.");
    } else if (!data.bthLang.trim()) {
      setErrorMessage("Please select language.");
    } else if (data.bthMode === "Online" && !data.bthLink.trim()) {
      setErrorMessage("Please provide meeting link.");
    } else if (data.bthMode !== "Online" && !data.bthLoc.trim()) {
      setErrorMessage("Please provide location details.");
    } else {
      try {
        const response = await fetch(`${BASE_API_URL}/api/batches`, {
          method: "POST",
          body: JSON.stringify({
            bthName: batchTitle,
            bthShift: data.bthShift,
            bthStart: data.bthStart,
            bthEnd: data.bthEnd,
            corId: data.corId,
            bthVtr: data.bthVtr,
            bthWhatGrp: data.bthWhatGrp,
            bthTeleGrp: data.bthTeleGrp,
            bthLang: data.bthLang,
            bthMode: data.bthMode,
            bthLink: data.bthLink,
            bthLoc: data.bthLink,
            bthBank: data.bthBank,
            bthQr: image,
            createdBy: loggedInUser.result._id,
          }),
        });

        const post = await response.json();

        if (post.success === false) {
          toast.error(post.msg);
        } else {
          toast.success(post.msg);
          router.push("/account/batch-list");
        }
      } catch (error) {
        toast.error("Error creating batch.");
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
    <div>
      <form
        className="flex flex-col gap-4 h-auto border-[1.5px] border-orange-500 p-6 rounded-md"
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
                {volunteer?.map((vol) => {
                  return (
                    <option key={vol._id} value={vol._id}>
                      {vol.sdkFstName}
                    </option>
                  );
                })}
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
                value={data.bthStart}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">End Date</label>
              <input
                type="date"
                className="inputBox"
                name="bthEnd"
                value={data.bthEnd}
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
              <option value="Offline w/o acc">Offline w/o acc</option>
              <option value="Offline w acc">Offline w acc</option>
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
        {data.bthMode === "Offline w acc" && (
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
        {data.bthMode === "Offline w/o acc" && (
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
              rows={6}
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
              <Image src={preview || "/default-image.png"} alt="qr-code" width={400} height={400} />
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
export default AddNewBatch;
