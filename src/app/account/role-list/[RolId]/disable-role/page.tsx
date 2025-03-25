"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Loading from '@/app/account/Loading';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';

interface RoleNameProps {
    roleType:string
}

interface IRoleParams {
    params: Promise<{
       RolId?: string;
    }>;
}

const DisableRole : React.FC <IRoleParams>= ({params}) => {

    const router = useRouter();
    const { RolId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [roleName, setRoleName] = useState<RoleNameProps>({roleType:''});
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
  
    useEffect(() => { 
    async function fetchRoleById() { 
    try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/role-list/${RolId}/view-role`, {cache: "no-store"}); 
            const rolData = await res.json(); 
            setRoleName(rolData.rolById);      
        } catch (error) { 
            console.error("Error fetching roleData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchRoleById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
        try 
        {
            const response = await fetch(`${BASE_API_URL}/api/role-list/${RolId}/disable-role`, {
                method: 'PATCH',
                body: JSON.stringify({
                    disabledBy: loggedInUser.result?._id
                })
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/role-list');
            }
        } catch (error) {
            toast.error('Error updating role.');
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    };

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[350px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this category?</p>
                    <p className="font-bold text-xl text-green-600">{roleName.roleType}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/role-list')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableRole;
