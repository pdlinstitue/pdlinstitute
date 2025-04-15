"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, use, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Loading from '../../Loading';

interface IChangePwdParams {
  params:Promise<{
    SdkId:string
  }>
}

interface ChangePwdProps {
  sdkPwd: string;
  sdkNewPwd: string;
  sdkConfPwd: string;
  updatedBy: string;
}

const ChangePassword : React.FC<IChangePwdParams>= ({params}) => {

  const router = useRouter();
  const {SdkId} = use(params);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [changePwd, setChangePwd] = useState<ChangePwdProps>({sdkPwd: '', sdkNewPwd: '', sdkConfPwd: '', updatedBy: ''});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setChangePwd((prevData) => (
      { ...prevData, [name]: value }
    ));
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(''); // Clear the previous error

    try {
      if (!changePwd.sdkPwd.trim()) {
        setErrorMessage('Old password is required.');
    } else if (!changePwd.sdkNewPwd.trim()) {
        setErrorMessage('New password is required.');
    } else if (!changePwd.sdkConfPwd.trim()) {
        setErrorMessage('Confirm password is required.');
    } else {
      const response = await fetch(`${BASE_API_URL}/api/users/${SdkId}/change-password`, {
        method: 'PUT',
        body: JSON.stringify({
            sdkPwd: changePwd.sdkPwd,
            sdkNewPwd: changePwd.sdkNewPwd,
            sdkConfPwd: changePwd.sdkConfPwd,
            updatedBy: loggedInUser.result._id
        }),
      });

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
          toast.error('Error changing password.');
      } finally {
        setIsSaving(false);
      }
    };

  if (isLoading) {
    return <div>
      <Loading />
    </div>;
  }
  
  return (
    <div className='flex justify-center items-center my-24'> 
        <form className='flex w-[400px] flex-col border border-orange-500 p-9 gap-2 rounded-md shadow-xl' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <label>Old Password:</label>
                <input type='password' className='inputBox' name='sdkPwd' value={changePwd.sdkPwd} onChange={handleChange} />
            </div>
            <div className='flex flex-col gap-2'>
                <label>New Password:</label>
                <input type='password' className='inputBox' name='sdkNewPwd' value={changePwd.sdkNewPwd} onChange={handleChange} />
            </div>
            <div className='flex flex-col gap-2'>
                <label>Confirm Password:</label>
                <input type='password' className='inputBox' name='sdkConfPwd' value={changePwd.sdkConfPwd} onChange={handleChange}/>
            </div>
            {errorMessage && <p className="text-sm italic text-red-600">{errorMessage}</p>}
            <div className="grid grid-cols-2 gap-1">
              <button 
                type='submit' 
                className='btnLeft'
                disabled={isSaving} 
                >
                {isSaving ? 'Saving...' : 'Save'}
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
  )
}

export default ChangePassword;
