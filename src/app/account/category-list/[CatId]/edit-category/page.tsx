"use client";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { use } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loading from "@/app/account/Loading";

interface ICatParams {
    params: Promise<{
        CatId?: string;
    }>;
}

interface CatType {
    catName: string;
    updatedBy: string;
}

const EditCategory: React.FC<ICatParams> = ({ params }) => {

    const { CatId } = use(params);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [data, setData] = useState<CatType>({ catName: '', updatedBy: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loggedInUser = {
        result:{
          _id:Cookies.get("loggedInUserId"), 
          usrName:Cookies.get("loggedInUserName"),
          usrRole:Cookies.get("loggedInUserRole"),
        }
    };

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log(data);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage(''); // Clear the previous error message

        if (!data.catName.trim()) {
            setErrorMessage('Category name is required.');
        } else{
            try {
                const response = await fetch(`${BASE_API_URL}/api/categories/${CatId}/edit-category`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        catName: data.catName,
                        updatedBy: loggedInUser.result._id
                    }),
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
            <form className="formStyle w-[350px] my-24" onSubmit={handleSubmit}>
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
                    <button type="button" className="btnRight" onClick={()=> router.push("/account/category-list")}>
                        BACK
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
