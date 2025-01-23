"use client";
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';

interface CatNameProps {
    catName:string
}

interface ICatParams {
    params: Promise<{
        CatId?: string;
    }>;
}

const DisableCategory : React.FC <ICatParams>= ({params}) => {

  const router = useRouter();
  const { CatId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [catName, setCatName] = useState<CatNameProps>({catName:''});
  
    useEffect(() => { 
    async function fetchEventById() { 
        try 
            { 
                const res = await fetch(`${BASE_API_URL}/api/categories/${CatId}/view-category`, {cache: "no-store"}); 
                const catData = await res.json(); 
                setCatName(catData.catById);      
            } catch (error) { 
                console.error("Error fetching eventData:", error); 
            } finally {
                setIsLoading(false);
            }
        } fetchEventById(); 
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/categories/${CatId}/disable-category`, {
                method: 'PATCH'
            });

            const post = await response.json();

            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/category-list');
            }
        } catch (error) {
            toast.error('Error updating category.');
        }
    };

  return (
    <div className='flex justify-center items-center'>
        <div className="formStyle w-[350px] my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">Are you sure to disable this category?</p>
                    <p className="font-bold text-xl text-green-600">{catName.catName}</p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/category-list')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableCategory;
