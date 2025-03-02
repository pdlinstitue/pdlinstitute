"use client";
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, use, useState } from 'react';
import toast from 'react-hot-toast';

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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [changePwd, setChangePwd] = useState<ChangePwdProps>({sdkPwd: '', sdkNewPwd: '', sdkConfPwd: '', updatedBy: ''});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setChangePwd((prevData) => (
      { ...prevData, [name]: value }
    ));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error

    if (!changePwd.sdkPwd.trim()) {
        setErrorMessage('Old password is required.');
    } else if (!changePwd.sdkNewPwd.trim()) {
        setErrorMessage('New password is required.');
    } else if (!changePwd.sdkConfPwd.trim()) {
        setErrorMessage('Confirm password is required.');
    } else {
      try {
        const response = await fetch(`${BASE_API_URL}/api/users/${SdkId}/change-password`, {
          method: 'PUT',
          body: JSON.stringify({
              sdkPwd: changePwd.sdkPwd,
              sdkNewPwd: changePwd.sdkNewPwd,
              sdkConfPwd: changePwd.sdkConfPwd,
              updatedBy: SdkId
          }),
        });

        const post = await response.json();
        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/dashboard');
        }
      } catch (error) {
          toast.error('Error changing password.');
      }
    }
  };
  
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
              <button type='submit' className='btnLeft'>SAVE</button>
              <button type='button' className='btnRight' onClick={()=> router.push('/account/dashboard')}>BACK</button>
            </div>
        </form>
    </div>
  )
}

export default ChangePassword;
