"use client";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { use } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loading from "@/app/account/Loading";

interface IRoleParams {
    params: Promise<{
        RolId?: string;
    }>;
}

interface CatType {
    roleType: string;
    updatedBy: string;
}

const EditRole: React.FC<IRoleParams> = ({ params }) => {

    const { RolId } = use(params);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [data, setData] = useState<CatType>({ roleType: '', updatedBy: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loggedInUser, setLoggedInUser] = useState({
        result: {
          _id: '',
          usrName: '',
          usrRole: '',
        },
      });
       
      useEffect(() => {
        try {
          const userId = Cookies.get("loggedInUserId") || '';
          const userName = Cookies.get("loggedInUserName") || '';
          const userRole = Cookies.get("loggedInUserRole") || '';
          setLoggedInUser({
            result: {
              _id: userId,
              usrName: userName,
              usrRole: userRole,
            },
          });
        } catch (error) {
            console.error("Error fetching loggedInUserData.");
        } finally {
          setIsLoading(false);
        }
      }, []);
      
    useEffect(() => {
    async function fetchRoleById() {
        try 
            {
                const res = await fetch(`${BASE_API_URL}/api/role-list/${RolId}/view-role`, { cache: "no-store" });
                const rolData = await res.json();
                setData(rolData.rolById);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRoleById();
    }, [RolId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage(''); // Clear the previous error message

        if (!data.roleType.trim()) {
            setErrorMessage('Role type is required.');
        } else{
            try {
                const response = await fetch(`${BASE_API_URL}/api/role-list/${RolId}/edit-role`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        roleType: data.roleType,
                        updatedBy: loggedInUser.result?._id
                    }),
                });
    
                const post = await response.json();
                if (post.success === false) {
                    toast.error(post.msg);
                } else {
                    toast.success(post.msg);
                    router.push('/account/role-list');
                }
            } catch (error) {
                toast.error('Error updating role type.');
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
                    <label className="font-semibold uppercase">Role Type:</label>
                    <input type="text" className="inputBox" name="roleType" value={data.roleType} onChange={handleChange} placeholder="Define role type"
                />
                </div>
                {errorMessage && <p className='text-red-600 italic text-xs '>{errorMessage}</p>}
                <div className="grid grid-cols-2 gap-1">
                    <button type="submit" className="btnLeft">
                        UPDATE
                    </button>
                    <button type="button" className="btnRight" onClick={()=> router.push("/account/role-list")}>
                        BACK
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRole;
