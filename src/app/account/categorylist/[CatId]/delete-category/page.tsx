"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX } from 'react';
import { use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DelCatParams {
    params: Promise<{
        CatId?: string;
    }>;
}

const DelCategory: React.FC<DelCatParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { CatId } = use(params);
    
    const handleDelCat = async (): Promise<void> => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/categories/${CatId}/delete-category`, {
                method: 'DELETE',
            });

            // if (!res.ok) {
            //     throw new Error("Failed to fetch catData");
            // }
            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/categorylist');
            }
        } catch (error) {
            toast.error("Category deletion failed.");
        }
    }

    return (
        <div>
            <div className="flex w-[350px] mx-auto rounded-md shadow-lg p-9 border-[1.5px] border-orange-500 my-24">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl p-3 text-center text-red-600 font-semibold">Alert !</h1>
                        <p className="text-center">
                            Won't be able to restore. Are you sure to delete?
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelCat} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/categorylist')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelCategory;
