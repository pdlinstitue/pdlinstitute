"use client";
import { BASE_API_URL } from "../utils/constant";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface IForgotPass {
    sdkEmail:string;
}

const ForgotPassword = () => {

    const router = useRouter();
    const [pwd, setPwd] = useState<IForgotPass>({sdkEmail:''});
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (e:any) =>{
        const name = e.target.name;
        const value = e.target.value;
        console.log(name, value);
        setPwd((prev) =>{
            return {...prev,[name]:value  }
        });
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); //Clear the previous error message.
        if (!pwd.sdkEmail?.trim() || '') {
            setErrorMessage('Please enter your email.');    
        } else {
        try
        {
          const result = await fetch (`${BASE_API_URL}/api/forgot-password`, 
          {
            method:'PUT',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
                sdkEmail: pwd.sdkEmail
            }),
          });

          const post = await result.json();      
          
          if(post.success === false){    
                toast.error(post.msg);    
            }else{
              toast.success(post.msg);
            }
        }catch(error){
            console.log(error);    
          }
        }         
    };

    return ( 
        <div>
        <div className='flex w-auto h-screen justify-center items-center p-9'>
           <form className="flex flex-col p-9 w-[400px] h-auto shadow-xl border-[1.5px] border-orange-700 rounded-lg" onSubmit={handleSubmit}>
               <span className='text-center p-3 bg-gray-200 font-bold rounded-md mb-3'>RESET PASSWORD</span>
               <div className='flex flex-col gap-2 mb-3'>
                   <label className="block font-semibold">Email Id: </label>
                   <input type="email" name='sdkEmail' value={pwd.sdkEmail} onChange={handleChange} placeholder="Registered email id." className="inputBox"/>
               </div>
               {errorMessage && <p className='text-red-600 text-sm italic '>{errorMessage}</p>}
               <div className="grid grid-cols-2 gap-1">
                    <button type='submit' className='btnLeft'>SUBMIT</button>
                    <button type='button' className='btnRight' onClick={()=> router.push('/login')}>BACK</button>
               </div>
           </form> 
        </div>
     </div>
     );
}
 
export default ForgotPassword;