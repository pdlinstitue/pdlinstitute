"use client";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import { useEffect, useState } from "react";
import { use } from "react";
import Loading from "@/app/account/Loading";

interface ICatParams {
    params: Promise<{
        CatId?: string;
    }>;
}

interface CatType {
    catName: string;
}

const ViewCategory: React.FC<ICatParams> = ({ params }) => {

    const { CatId } = use(params);
    const router = useRouter();
    const [data, setData] = useState<CatType>({ catName: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
    async function fetchCatById() {
        try {
            const res = await fetch(`${BASE_API_URL}/api/categories/${CatId}/view-category`, { cache: "no-store" });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const catData = await res.json();
            setData(catData.catById);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchCatById();
    }, [CatId]);


    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full">
            <form className="flex flex-col w-[350px] shadow-lg rounded-md h-auto p-9 mx-auto my-24 border-[1.5px] border-orange-500">
                <div className="flex flex-col mb-3 gap-2">
                    <label className="font-semibold uppercase">Category:</label>
                    <input type="text" className="inputBox" name="catName" value={data.catName} readOnly/>
                </div>
                <div className="mt-3">
                    <button type="button" className="btnLeft" onClick={()=>router.push("/account/categorylist")}>
                        BACK
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ViewCategory;
