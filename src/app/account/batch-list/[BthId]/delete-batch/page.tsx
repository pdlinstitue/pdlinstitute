"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import Loading from "@/app/account/Loading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DelBatchParams {
    params: Promise<{
        BthId?: string;
    }>;
}

interface BatchNameProps {
    bthName:string
}

const DelBatch: React.FC<DelBatchParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { BthId } = use(params);
    const [data, setData] = useState<BatchNameProps>({ bthName: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
    async function fetchBatchById() {
        try 
        {
            const res = await fetch(`${BASE_API_URL}/api/batches/${BthId}/view-batch`, { cache: "no-store" });
            const batchData = await res.json();
            setData(batchData.bthById);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchBatchById();
    }, [BthId]);
    
    const handleDelBatch = async (): Promise<void> => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/batches/${BthId}/delete-batch`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/batch-list');
            }
        } catch (error) {
            toast.error("Batch deletion failed.");
        }
    };

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        )
    };

    return (
        <div className="flex justify-center items-center">
            <div className="formStyle w-[450px] my-24">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl p-3 text-center text-red-600 font-semibold">Alert !</h1>
                        <p className="text-center">
                            Won't be able to restore. Are you sure to delete?
                        </p>
                        <p className="font-bold text-center text-xl text-green-600">
                            {data.bthName}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelBatch} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/batch-list')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelBatch;
