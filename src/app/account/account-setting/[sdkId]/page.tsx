"use client";
import Loading from '../../Loading';
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface AccountSettingProps {
  _id?: string;
  sdkPhone: string;
  sdkWhtNbr: string;
  sdkEmail: string;
  updatedBy?: string;
}

interface IAccountParams {
  params:Promise<{
    SdkId: string;
  }>
}

const AccountSetting : React.FC<IAccountParams> = ({params}) => {

  const router = useRouter();
  const { SdkId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [contactDetails, setContactDetails] = useState<AccountSettingProps>({sdkPhone: '', sdkWhtNbr: '', sdkEmail: ''});
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setContactDetails((prevData) => (
      { ...prevData, [name]: value }
    ));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(''); // Clear the previous error

    if (!contactDetails.sdkPhone.trim()) {
        setErrorMessage('Phone is required.');
    } else if (!contactDetails.sdkWhtNbr.trim()) {
        setErrorMessage('Whatsapp number is required.');
    } else if (!contactDetails.sdkEmail.trim()) {
        setErrorMessage('Email is required.');
    } else {
      try {
        const response = await fetch(`${BASE_API_URL}/api/users/${SdkId}/update-contact`, {
          method: 'PUT',
          body: JSON.stringify({
              sdkPhone: contactDetails.sdkPhone,
              sdkWhtNbr: contactDetails.sdkWhtNbr,
              sdkEmail: contactDetails.sdkEmail,
              updatedBy: loggedInUser.result._id
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
          toast.error('Error updating contact details.');
      }
    }
  };

  useEffect(() => {
    async function fetchContactDetails() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/users/${SdkId}/view-sadhak`, { cache: "no-store" });
        const data = await response.json();
        setContactDetails(data.sdkById);
      } catch (error) {
        console.error('Error fetching contact details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContactDetails();
  }, []);

  if (isLoading) {
    return <div>
      <Loading />
    </div>;
  }

  return (
    <div className='flex justify-center items-center my-24'> 
        <form className='flex w-[400px] flex-col border border-orange-500 p-9 gap-2 rounded-md shadow-xl' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <label>Phone:</label>
                <input type='text' className='inputBox' name='sdkPhone' value={contactDetails.sdkPhone}  onChange={handleChange}/>
            </div>
            <div className='flex flex-col gap-2'>
                <label>WhatsApp:</label>
                <input type='text' className='inputBox' name='sdkWhtNbr' value={contactDetails.sdkWhtNbr}  onChange={handleChange} />
            </div>
            <div className='flex flex-col gap-2'>
                <label>Email:</label>
                <input type='email' className='inputBox' name='sdkEmail' value={contactDetails.sdkEmail}  onChange={handleChange} />
            </div>
            {errorMessage && <p className="text-sm italic text-red-600">{errorMessage}</p>}
            <div className="grid grid-cols-2 gap-1">
              <button type='submit' className='btnLeft'>SUBMIT</button>
              <button type='button' className='btnRight' onClick={()=> router.push('/account/dashboard')}>BACK</button>
            </div>
        </form>
    </div>
  )
}

export default AccountSetting;
