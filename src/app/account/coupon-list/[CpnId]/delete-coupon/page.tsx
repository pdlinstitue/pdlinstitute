"use client";
import { BASE_API_URL } from "@/app/utils/constant";
import { JSX, useEffect, useState } from 'react';
import { use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/account/Loading";

interface DelCpnParams {
    params: Promise<{
        CpnId?: string;
    }>;
}

interface CouponProps {
    _id: string,
    cpnName:string
}

const DelCoupon: React.FC<DelCpnParams> = ({ params }): JSX.Element => {
    
    const router = useRouter();
    const { CpnId } = use(params);
    
    const handleDelCoupon = async (): Promise<void> => {
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/coupons/${CpnId}/delete-coupon`, {
                method: 'DELETE',
            });

            const post = await res.json();
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/coupon-list');
            }
        } catch (error) {
            toast.error("Coupon deletion failed.");
        }
    };

    const [isLoading, setIsLoading] = useState(true);
      const [couponName, setCouponName] = useState<CouponProps>({_id:'', cpnName:''});
    
      useEffect(() => { 
      async function fetchCouponById() { 
      try 
        { 
            const res = await fetch(`${BASE_API_URL}/api/coupons/${CpnId}/view-coupon`, {cache: "no-store"}); 
            const couponData = await res.json(); 
            setCouponName(couponData.cpnById);      
        } catch (error) { 
            console.error("Error fetching eventData:", error); 
        } finally {
            setIsLoading(false);
        }
        } fetchCouponById(); 
        }, []);

    if(isLoading){
        return <div>
            <Loading/>
        </div>
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
                        <p className='text-green-600 font-bold text-xl'>{couponName.cpnName}</p>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={handleDelCoupon} className="btnLeft w-full">CONFIRM</button>
                        <button type="button" onClick={() => router.push('/account/coupon-list')} className="btnRight w-full">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DelCoupon;
