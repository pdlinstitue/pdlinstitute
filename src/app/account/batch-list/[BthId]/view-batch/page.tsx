"use client";
import React, { FormEvent, useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "@/app/account/Loading";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface VolunteerListProps {
  _id: string;
  sdkFstName: string;
}

interface IBthParam {
  params:Promise<{
    BthId:string
  }>
}
interface EditBatchProps {
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
}

const ViewBatch: React.FC <IBthParam>= ({params}) => {

  const router = useRouter();
  const {BthId} = use(params);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [volunteer, setVolunteer] = useState<VolunteerListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [coList, setCoList] = useState<{ _id: string; coNick: string; coName: string }[] | null>([]);
  const [batchTitle, setBatchTitle] = useState("");
  const [data, setData] = useState<EditBatchProps>({
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
  });
  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: '',
      usrName: '',
      usrRole: '',
    },
  });
   
  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || '';
      const userName = Cookies.get("loggedInUserName") || '';
      const userRole = Cookies.get("loggedInUserRole") || '';
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

  useEffect(() => {
  async function fetchBatchDataById() {
    try {
      const res = await fetch(`${BASE_API_URL}/api/batches/${BthId}/view-batch`, {
        cache: "no-store",
      });
      const batchDataList = await res.json();
      setData(batchDataList.bthById);
    } catch (error) {
        console.error("Error fetching course data:", error);
    } finally {
        setIsLoading(false);
    }
  }
  fetchBatchDataById();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <form className="formStyle w-full">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Batch Title:</label>
              <input
                type="text"
                className="inputBox"
                name="bthName"
                value={data.bthName}
                onChange={handleChange}
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
              rows={15}
              className="inputBox"
              name="bthBank"
              value={data.bthBank}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
              <label>QR Code:</label>
              <Image src={preview || "/images/uploadImage.jpg"} alt="qr-code" width={600} height={400} />
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
        <div className="flex gap-1 w-full">
          <button
            type="button"
            className="btnLeft w-full"
            onClick={() => router.push("/account/batch-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default ViewBatch;