"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import Loading from "@/app/account/Loading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DelMatParams {
    params: Promise<{
        MatId?: string;
    }>;
}

interface MatNameProps {
    matName:string
}

const DelMaterial: React.FC<DelMatParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { MatId } = use(params);
    const [data, setData] = useState<MatNameProps>({ matName: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
    async function fetchMatById() {
        try 
        {
            const res = await fetch(`${BASE_API_URL}/api/materials/${MatId}/view-material`, { cache: "no-store" });
            const matData = await res.json();
            setData(matData.matById);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchMatById();
}, [MatId]);
    
    const handleDelMat = async (): Promise<void> => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/materials/${MatId}/delete-material`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/study-materials');
            }
        } catch (error) {
            toast.error("Material deletion failed.");
        }
    };

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center">
            <div className="formStyle w-[300px] my-24">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl p-3 text-center text-red-600 font-semibold">Alert !</h1>
                        <p className="text-center">
                            Won't be able to restore. Are you sure to delete?
                        </p>
                        <p className="font-bold text-center text-xl text-green-600">
                            {data.matName}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelMat} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/study-materials')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelMaterial;
