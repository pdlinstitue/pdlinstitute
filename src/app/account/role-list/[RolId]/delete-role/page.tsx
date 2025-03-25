"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import Loading from "@/app/account/Loading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DelRoleParams {
    params: Promise<{
        RolId?: string;
    }>;
}

interface RoleNameProps {
    roleType:string
}

const DelRole: React.FC<DelRoleParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { RolId } = use(params);
    const [data, setData] = useState<RoleNameProps>({ roleType: '' });
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
    
    const handleDelRole = async (): Promise<void> => {
        try {
            const res = await fetch(`${BASE_API_URL}/api/role-list/${RolId}/delete-role`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/role-list');
            }
        } catch (error) {
            toast.error("Role deletion failed.");
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
            <div className="formStyle w-[350px] my-24">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl p-3 text-center text-red-600 font-semibold">Alert !</h1>
                        <p className="text-center">
                            Won't be able to restore. Are you sure to delete?
                        </p>
                        <p className="font-bold text-center text-xl text-green-600">
                            {data.roleType}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelRole} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/role-list')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelRole;
