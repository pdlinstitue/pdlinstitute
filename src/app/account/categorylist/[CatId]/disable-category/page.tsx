"use client";
import { use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { FormEvent, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';


interface DisableCatProps{
    isActive: boolean;
}

interface ICatParams {
    params: Promise<{
        CatId?: string;
    }>;
}

const DisableCategory : React.FC <ICatParams>= ({params}) => {

  const router = useRouter();
  const { CatId } = use(params);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
        const response = await fetch(`${BASE_API_URL}/api/categories/${CatId}/disable-category`, {
            method: 'PATCH'
        });

        const post = await response.json();
        console.log(post);

        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/categorylist');
        }
    } catch (error) {
        toast.error('Error updating category.');
    }
};

  return (
    <div>
        <div className="flex w-[350px] mx-auto rounded-md shadow-lg p-9 border-[1.5px] border-orange-500 my-24">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl p-3 text-center text-yellow-500 font-semibold">Warning !</h1>
                    <p className="text-center">
                        Are you sure to disable this category?
                    </p>
                </div>
                <div className="flex gap-1">
                    <button type="submit"  className="btnLeft w-full">CONFIRM</button>
                    <button type="button" onClick={() => router.push('/account/categorylist')} className="btnRight w-full">CANCEL</button>
                </div>
            </form>
       </div>
    </div>
  )
}

export default DisableCategory;
