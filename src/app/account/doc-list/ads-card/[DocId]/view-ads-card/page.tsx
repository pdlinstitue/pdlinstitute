'use client';
import React, { FormEvent, use, useEffect, useState } from 'react';
import Loading from '@/app/account/Loading';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_API_URL } from '@/app/utils/constant';
import toast from 'react-hot-toast';

interface IDocParams{
    params: Promise<{
        DocId?: string
    }>;
}

interface ViewIDCardProps {
    _id?: string;
    sdkAdsProof: string;
    sdkAdsNbr: string;
    sdkRemarks: string;
}

const ViewAdsCard : React.FC<IDocParams> = ({params}) => {

    const router = useRouter();
    const {DocId} = use(params);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [adsData, setAdsData] = useState<ViewIDCardProps>({sdkAdsProof:"", sdkAdsNbr:"", sdkRemarks:""});
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchAdsData = async () => {
            try {
                const res = await fetch(`/api/documents/${DocId}/view-doc`);
                const data = await res.json();
                setAdsData(data.docById);
            } catch (error) {
                console.error("Error fetching idData: ", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAdsData();
    },[]);

    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setAdsData((prev) =>{
            return {
                ...prev, [name]: value
            }
        }); 
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); 
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/documents/${DocId}/view-doc`, {
                method: 'PATCH',
                body: JSON.stringify({ 
                    sdkDocStatus:status, 
                    sdkRemarks: adsData.sdkRemarks,
                    sdkAdsNbr: adsData.sdkAdsNbr,
                    sdkAprDate: new Date(),
                }),
            });
            const post = await response.json();
            console.log(post);
            
            if (post.success === false) {
                toast.error(post.msg);
            } else {
                toast.success(post.msg);
                router.push('/account/doc-list/ads-card');
            }
        } catch (error) {
            toast.error('Error updating adsData.');
        }
    };

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    }

  return (
    <div className='flex items-center justify-center'>
      <form className='formStyle  w-[450px] my-3' onSubmit={handleSubmit}>
         <div className=' bg-gray-200 w-auto h-auto rounded-md'>
            <Image alt='adsCardImg' src="/#" width={420} height={250}/>
         </div>
         <div className='flex flex-col gap-2'>
            <label>ID Number:</label>
            <input className='inputBox' name='sdkIdNbr' value={adsData.sdkAdsNbr} onChange={handleChange}></input>
         </div>
         <div className='flex flex-col gap-2'>
            <label>Remarks:</label>
            <textarea className='inputBox' name='sdkRemarks' value={adsData.sdkRemarks} onChange={handleChange} placeholder='Remarks'></textarea>
         </div>
         <div className='grid grid-cols-3 gap-1 items-center mt-3'>
            <button type='submit' className='btnLeft' onClick={() => setStatus('Approved')}>Approve</button>
            <button type='submit' className='btnRight' onClick={() => setStatus('Rejected')}>Reject</button>
            <button type='button' className='btnLeft' onClick={()=>router.push('/account/doc-list/ads-card')}>BACK</button>
         </div>
      </form>
    </div>
  )
}

export default ViewAdsCard;
