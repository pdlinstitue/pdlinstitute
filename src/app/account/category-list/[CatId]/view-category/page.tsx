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
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/categories/${CatId}/view-category`, { cache: "no-store" });
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
        <div className="flex justify-center items-center">
            <form className="formStyle w-[350px] my-24 ">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold uppercase">Category:</label>
                    <input type="text" className="inputBox" name="catName" value={data.catName} readOnly/>
                </div>
                <div className="mt-3">
                    <button type="button" className="btnLeft" onClick={()=>router.push("/account/category-list")}>
                        BACK
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ViewCategory;
