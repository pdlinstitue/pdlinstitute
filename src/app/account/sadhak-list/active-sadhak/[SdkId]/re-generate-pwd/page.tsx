"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { TfiReload } from "react-icons/tfi";
import { MdOutlineCopyright } from "react-icons/md";
import React, { ChangeEvent, FormEvent, use, useState } from 'react';
import toast from 'react-hot-toast';

interface IRegenPwdParams {
  params:Promise<{
    SdkId:string
  }>
}

interface ChangePwdProps {
  sdkRegPwd: string;
  sdkRegPwdExpiry:Date;
  updatedBy: string;
}

const generateRandomPassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const number = '0123456789';
    const special = '!@#$%^&*?';
    const allChars = upper + lower + number + special;

    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    for (let i = 1; i < 8; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => 0.5 - Math.random()).join(''); // Shuffle the password
}

const RegeneratePassword : React.FC<IRegenPwdParams>= ({params}) => {

  const router = useRouter();
  const {SdkId} = use(params);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [regPwd, setRegPwd] = useState<ChangePwdProps>({sdkRegPwd:'', updatedBy:'', sdkRegPwdExpiry:new Date});

  const loggedInUser = {
    result:{
      _id:Cookies.get("loggedInUserId"), 
      usrName:Cookies.get("loggedInUserName"),
      usrRole:Cookies.get("loggedInUserRole"),
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRegPwd((prevData) => (
      { ...prevData, [name]: value }
    ));
  };

  const handleGeneratePassword = (): void => {
    const newPassword = generateRandomPassword();
    setRegPwd((prevData) => ({ ...prevData, sdkRegPwd: newPassword }));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(regPwd.sdkRegPwd);
    toast.success('Text copied!');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error

    if (!regPwd.sdkRegPwd.trim()) {
        setErrorMessage('Please generate password.');
    } else {
      try {
        // Calculate sdkRegPwdExpiry as 15 minutes from the current time
        const sdkRegPwdExpiry = new Date();
        sdkRegPwdExpiry.setMinutes(sdkRegPwdExpiry.getMinutes() + 15);
        const response = await fetch(`${BASE_API_URL}/api/users/${SdkId}/re-generate-pwd`, {
          method: 'PUT',
          body: JSON.stringify({
            sdkRegPwd: regPwd.sdkRegPwd,
            sdkRegPwdExpiry,
            updatedBy: loggedInUser.result._id
          }),
        });

        const post = await response.json();
        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/sadhak-list/active-sadhak');
        }
        } catch (error) {
            toast.error('Error re-generating password.');
        }
      }
    };
  
  return (
    <div className='flex justify-center items-center my-24'> 
        <form className='flex w-auto flex-col border border-orange-500 p-9 gap-2 rounded-md shadow-xl' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <label>Regenerate Password:</label>
                <div className='flex gap-1 items-center'>
                  <input type='text' className='inputBox' name='sdkRegPwd' value={regPwd.sdkRegPwd} onChange={handleChange} />
                  <button type='button' className='p-[13px] bg-orange-600 text-white' onClick={handleGeneratePassword}><TfiReload size={16}/></button>
                  <button type='button' className='p-[9px] bg-gray-600 text-white' onClick={handleCopyToClipboard}><MdOutlineCopyright size={24}/></button>
                </div>
            </div>
            {errorMessage && <p className="text-sm italic text-red-600">{errorMessage}</p>}
            <div className="grid grid-cols-2 gap-1">
              <button type='submit' className='btnLeft'>SAVE</button>
              <button type='button' className='btnRight' onClick={()=> router.push('/account/sadhak-list/active-sadhak')}>BACK</button>
            </div>
        </form>
    </div>
  )
}

export default RegeneratePassword;
