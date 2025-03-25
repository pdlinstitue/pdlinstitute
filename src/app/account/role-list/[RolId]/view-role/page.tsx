"use client";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import { useEffect, useState } from "react";
import { use } from "react";
import Loading from "@/app/account/Loading";

interface IRoleParams {
    params: Promise<{
        RolId?: string;
    }>;
}

interface RolType {
    roleType: string;
}

const ViewRole: React.FC<IRoleParams> = ({ params }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const { RolId } = use(params);
    const router = useRouter();
    const [data, setData] = useState<RolType>({ roleType: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                <div className="flex flex-col mb-3 gap-2">
                    <label className="font-semibold uppercase">Role Type:</label>
                    <input type="text" className="inputBox" name="roleType" value={data.roleType} onChange={handleChange}/>
                </div>
                <div className="mt-3">
                    <button type="button" className="btnLeft" onClick={()=>router.push("/account/role-list")}>
                        BACK
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ViewRole;
