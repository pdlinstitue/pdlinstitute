"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/app/account/Loading';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';

interface SideMenuProps {
    menuName:string
}

interface ISideMenuParams {
    params: Promise<{
        SideId: string;
    }>;
}

const DeleteSideMenu : React.FC <ISideMenuParams>= ({params}) => {

    const router = useRouter();
    const { SideId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [sideMenuName, setSideMenuName] = useState<SideMenuProps>({menuName:''});

  
    useEffect(() => { 
    async function fetchSideMenuById() { 
    try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/sidemenu-list/${SideId}/view-sidemenu`, {cache: "no-store"}); 
            const menuData = await res.json(); 
            setSideMenuName(menuData.sideMenuById);      
        } catch (error) { 
            console.error("Error fetching classData:", error); 
        } finally {
            setIsLoading(false);
        }
    } fetchSideMenuById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
        try 
        {
            const response = await fetch(`${BASE_API_URL}/api/sidemenu-list/${SideId}/delete-sidemenu`, {
                method: 'DELETE',
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/sidemenu-list');
            }
        } catch (error) {
            toast.error('Error deleting sidemenu.');
        } finally {
            setIsSaving(false);
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
                    <h1 className="text-3xl p-3 text-red-600 font-semibold">Alert !</h1>
                    <p className="text-center"> Won't be able to restore. Are you sure to delete?</p>
                    <p className="font-bold text-xl text-green-600">{sideMenuName.menuName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full" disabled={isSaving}>
                        {isSaving ? "Confirming..." : "Confirm"}
                    </button>
                    <button type="button" onClick={() => router.push('/account/sidemenu-list')} className="btnRight w-full">Cancel</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DeleteSideMenu;
