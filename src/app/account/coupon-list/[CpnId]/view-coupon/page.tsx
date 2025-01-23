'use client';
import React, { use, useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import { FiEye } from 'react-icons/fi';


interface ICpnParams {
    params:Promise<{
        CpnId:String
    }>
}

interface ViewCouponProps {
  cpnName: string,
  cpnUse: number,
  cpnVal:number,
  cpnDisType: string,
  cpnDisc:number,
  cpnCourse: string,
  cpnFor: string,
  cpnSdk: [string],
  usrId?: string 
}

const ViewCoupon: React.FC<ICpnParams> = ({ params }) => {

    const router = useRouter();
    const { CpnId } = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<ViewCouponProps>({ cpnName: '', cpnUse: 0, cpnVal: 0, cpnDisType: '', cpnDisc: 0, cpnCourse: '', cpnFor: '', cpnSdk: [''] });
  
    useEffect(() => {
      async function fetchCouponByID() {
        try {
          const res = await fetch(`${BASE_API_URL}/api/coupons/${CpnId}/view-coupon`, { cache: "no-store" });
          const couponData = await res.json();
          setData(couponData.cpnById);
        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchCouponByID();
    }, [CpnId]);
  
    if (isLoading) {
      return <Loading />;
    }
  
    return (
      <div>
        <div className='formStyle w-full overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-200'>
              <tr className='uppercase text-left'>
                <th className=' p-2'>Sadhak Id</th>
                <th className=' p-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                data.cpnSdk.map((item, index) => (
                  <tr key={index} className=' hover:bg-gray-100 border-b-[1.5px] border-gray-200'>
                    <td className='p-2'>{item}</td>
                    <td className='p-2 '>
                        <button type='button' title='View' onClick={()=> router.push(`/account/coupon-list/${CpnId}/view-sadhak-coupon`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div className='w-auto'>
            <button type='button' className='btnLeft' onClick={()=> router.push(`/account/coupon-list`)}>BACK</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ViewCoupon;
