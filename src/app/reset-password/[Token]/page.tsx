'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { use } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';


interface IResetPass {
    sdkPwd: string;
    confPwd: string;
}

interface IResetPassParams {
    params: Promise<{
        Token?: string;
    }>;
}

const ResetPassword : React.FC <IResetPassParams> = ({ params }) => {

const [resetPwd, setResetPwd] = useState<IResetPass>({sdkPwd:'', confPwd:''});
const [errorMessage, setErrorMessage] = useState('');
const {Token} = use(params);
const router = useRouter();

const handleChange = (e:any) =>{
    const name = e.target.name;
    const value = e.target.value;
    setResetPwd((prev) =>{
        return {...prev,[name]:value  }
    });
}

const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error
    
    if (!resetPwd.sdkPwd?.trim() || '') {
        setErrorMessage('Please enter new password.');    
    } else if (!resetPwd.confPwd?.trim() || '') {
        setErrorMessage('Please enter confirm password.');    
    } else {
        try
        {
            
            const result = await fetch (`${BASE_API_URL}/api/reset-password`, 
            {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    token: Token, 
                    sdkPwd: resetPwd.sdkPwd, 
                    confPwd:resetPwd.confPwd
                }),
            });

            const post = await result.json();
            
            if(post.success==false){    
                toast.error(post.msg)      
            }else{
                toast.success(post.msg);
                router.push('/login');
            }
        } catch(error){
            console.log(error);    
        } 
    }};

  return (
    <div>
       <div className='flex flex-col h-screen w-auto mx-auto items-center justify-center px-9'>
        <div className="relative mx-auto text-center">
            <div className="mt-4 bg-white  rounded-lg text-left">
                <div className="h-2 bg-orange-600 rounded-t-md"></div>
                <form className="flex flex-col px-8 py-6 w-full shadow-2xl" onSubmit={handleSubmit}>
                    <span className='text-center p-3 bg-gray-200 font-bold rounded-md mb-3'>RESET YOUR PASSWORD</span>
                    <div className='flex flex-col gap-2 w-[460px] mb-3'>
                        <label className="block">New Password: </label>
                        <input type="password" name='sdkPwd' value={resetPwd.sdkPwd} onChange={handleChange} placeholder="min 8 alpha-numeric + special char." className="inputBox"/>
                    </div>
                    <div className='flex flex-col gap-2 w-[460px] mb-3'>
                        <label className="block">Confirm Password: </label>
                        <input type="password" name='confPwd' value={resetPwd.confPwd} onChange={handleChange} placeholder="min 8 alpha-numeric + special char." className="inputBox"/>
                    </div>
                    {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
                    <div className="grid grid-cols-2 gap-1">
                        <button type='submit' className='btnLeft'>SUBMIT</button>
                        <button type='button' className='btnRight' onClick={()=> router.push('/login')}>BACK</button>
                    </div>
                </form>  
            </div>
        </div>
      </div>
    </div>
  )
}
export default ResetPassword;