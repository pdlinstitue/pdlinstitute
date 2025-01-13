"use client";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { use } from "react";
import toast from "react-hot-toast";
import Loading from "@/app/account/Loading";

interface ICatParams {
    params: Promise<{
        CatId?: string;
    }>;
}

interface CatType {
    catName: string;
}

const EditCategory: React.FC<ICatParams> = ({ params }) => {

    const { CatId } = use(params);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>('');
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log(data);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage(''); // Clear the previous error
        let errMsg: string[] = [];

        if (!data.catName.trim()) {
            errMsg.push('Category name is required.');
        }

        if (errMsg.length > 0) {
            setErrorMessage(errMsg.join(' || '));
            return;
        }

        try {
            const response = await fetch(`${BASE_API_URL}/api/categories/${CatId}/edit-category`, {
                method: 'PUT',
                body: JSON.stringify({
                    catName: data.catName
                }),
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

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full">
            <form className="flex flex-col w-[350px] shadow-lg rounded-md h-auto p-9 mx-auto my-24 border-[1.5px] border-orange-500" onSubmit={handleSubmit}>
                <div className="flex flex-col mb-3 gap-2">
                    <label className="font-semibold uppercase">Category:</label>
                    <input type="text" className="inputBox" name="catName" value={data.catName} onChange={handleChange} placeholder="Category name"
                />
                </div>
                {errorMessage && <p className='text-red-600 italic text-xs '>{errorMessage}</p>}
                <div className="flex items-center gap-1 mt-3">
                    <button type="submit" className="btnLeft">
                        UPDATE
                    </button>
                    <button type="button" className="btnRight" onClick={()=> router.push("/account/categorylist")}>
                        BACK
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
