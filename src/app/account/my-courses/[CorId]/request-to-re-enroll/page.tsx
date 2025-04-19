'use client';
import Cookies from 'js-cookie';
import Loading from '@/app/account/Loading';
import React, { useState, useEffect, use } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface IMyCourseParams {
    params:Promise<{
        CorId:string;
    }>
}

interface SubmitRequestProps {
    corId: string,
    reqBy: string,
    reqReason: string,
}

const RequestToReEnroll : React.FC<IMyCourseParams> = ({params}) => {


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {CorId} = use(params);
    const router = useRouter();
    const [submitRequest, setSubmitRequest] = useState<SubmitRequestProps>({
        corId: "",
        reqBy: "",
        reqReason: "",
    });
    const [isSaving, setIsSaving] = useState<boolean>(false);
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
        setSubmitRequest((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      };

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`${BASE_API_URL}/api/request-to-re-enroll`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    corId: CorId,
                    reqBy: loggedInUser.result._id,
                    reqReason: submitRequest.reqReason,
                }),
            });
            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push("/account/my-courses/done-courses");
            }
        } catch (error:any) {
            console.error("Error submitting request:", error); 
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div>
            <Loading />
        </div>;
    };

  return (
    <div className='flex flex-col items-center justify-center'>
        <form className='formStyle w-auto my-24' onSubmit={handleSubmit}>
            <div className='flex flex-col'>
                <textarea 
                    id="reqReason"
                    name="reqReason"
                    placeholder='Please enter your reason for re-enrollment.'
                    required
                    rows={4}
                    value={submitRequest.reqReason}
                    onChange={handleChange}
                    className='inputBox'
                ></textarea>
            </div>
            <div className='grid grid-cols-1 gap-1'>
                <button type="submit" disabled={isSaving} className={`btnLeft w-full ${isSaving && "opacity-50 cursor-not-allowed"}`}>
                    {isSaving ? "Submitting..." : "Submit Request"}
                </button>
                <button type="button" onClick={() => router.push("/account/my-courses/done-courses")} className='btnRight w-full'>
                    Back
                </button>
            </div>
        </form>
    </div>
  )
}

export default RequestToReEnroll
