"use client";
import { NextPage } from 'next';
import React from 'react';
import Container from '../components/Container';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { BASE_API_URL } from '../utils/constant';
import NavMenu from '../components/navbar/navBar';


interface LoginType {
    sdkCred: string;
    sdkPwd: string;
}


const LoginPage : NextPage = () => {

    const router = useRouter();
    const [navigate, setNavigate] = useState<string | null>(null); 
    const [errorMessage,setErrorMessage] = useState<string>("");
    const [user, setUser] = useState<LoginType>({sdkCred:'', sdkPwd:''});

    useEffect(()=>{
      if (typeof window !== 'undefined' && window.location) {
          const searchParamsString = window.location.search;
          const searchParams = new URLSearchParams(searchParamsString);
          const navUrl = searchParams.get('navigate');
          setNavigate(navUrl);
      } else {
         console.error("window.location is not available in this environment.");
      }
    },[])

    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setUser((prev) =>{
        return {
            ...prev, [name]: value
        }
      }); 
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(''); // Clear the previous error
  
      if (!user.sdkCred?.trim()) {
          setErrorMessage('Please enter email or phone.');
      } else if (!user.sdkPwd?.trim()) {
          setErrorMessage('Please enter password.');
      } else {
        try {
            const result = await fetch(`${BASE_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sdkCred: user.sdkCred,
                    sdkPwd: user.sdkPwd
                }),
            });

             const post = await result.json();
            if (post.redirect && post.location) {
                window.location.href = post.location;
              } else if (post.success === false) {
                toast.error(post.msg);
            } else {
                Cookies.set("loggedInUserId", post.result.id);
                Cookies.set("loggedInUserName", post.result.usrName);
                Cookies.set("loggedInUserRole", post.result.usrRole);
                Cookies.set("token", post.result.usrToken);
                toast.success("Logged in successfully.");
                
                // Redirect conditionally based on user role
                if (post.result.usrRole === "Admin" || post.result.usrRole === "View-Admin") {
                    router.push("/account/admin-dashboard");
                } else {
                    router.push("/account/sadhak-dashboard");
                }
              }
          } catch (error) {
              toast.error('Error while logging in.');
          }
        }
      };

  return (
    <div>
      <NavMenu/>
      <Container>
        <title>LOGIN</title>
        <div className="flex max-w-[400px] p-6 mx-auto my-20 items-center justify-center">
          <form className="flex flex-col w-full p-9 gap-3 border-[1.5px] border-orange-500 shadow-lg rounded-md" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                  <label className="text-sm mb-2">Email/Phone:*</label>
                  <input type="text" className="inputBox" name="sdkCred" value={user.sdkCred} onChange={handleChange} placeholder="kartik@gmail.com"></input>
              </div>
              <div className="flex flex-col">
                  <label className="text-sm mb-2">Password:*</label>
                  <input type="password" className="inputBox" name="sdkPwd" value={user.sdkPwd} onChange={handleChange} placeholder="password"></input>
              </div>
              {errorMessage && <p className='text-red-600 italic text-sm'>{errorMessage}</p>}
              <button type="submit" className="btnLeft w-full rounded-sm" >
                  Login
              </button>
              <div className="flex flex-col items-center">
              <div className="flex gap-2 items-center">
                  <p className="text-sm">Dont have an account?</p> 
                  <Link href="/register" className="text-sm text-blue-500">
                      Register
                  </Link>
              </div>
              <div className="text-sm"> 
                  <Link href="/forgot-password" className='text-blue-500'>
                      Forgot password?
                  </Link>
              </div>
              </div>
          </form>
        </div>
    </Container>
    </div>
  )
}
export default LoginPage;
