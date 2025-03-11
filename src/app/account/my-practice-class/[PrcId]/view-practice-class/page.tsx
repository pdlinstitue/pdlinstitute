"use client";
import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loading from '@/app/account/Loading';
import { BASE_API_URL } from '@/app/utils/constant';

interface IPrcParams {
    params: Promise<{
        PrcId?: string;
    }>;
}

interface ViewMyPracticeClassProps {
  prcName:string,
  prcImg:string,
  prcLang:string,
  prcDays:string,
  prcStartsAt:string,
  prcEndsAt:string,
  prcLink:string,
  prcWhatLink: string,
  usrId?:string
 }

const ViewMyPracticeClass : React.FC<IPrcParams> = ({params}) => {

  const router = useRouter();
  const {PrcId} = use(params);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pracDays, setPracDays] = useState<string[] | null>([])
  const [data, setData] = useState<ViewMyPracticeClassProps>({prcName:'', prcLang:'', prcDays:'', prcStartsAt:'', prcEndsAt:'', prcLink:'', prcWhatLink:'',  prcImg:'', usrId:''});
  const practiceDays : string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];


  useEffect(() =>{
  async function fetchPracticeClassData() {
  try 
    {
        const prcData = await fetch(`${BASE_API_URL}/api/course-practice/${PrcId}/view-practice-class` , {cache: "no-store"});
        const prcClassById = await prcData.json();
        setData(prcClassById.prcById);
        setPracDays(prcClassById.prcById.prcDays);

    } catch (error) {
        console.error("Error fetching practiceClassData: ", error);
    } finally{
      setIsLoading(false);
    }
  }
  fetchPracticeClassData();
// eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if(isLoading){
    return<div>
      <Loading/>
    </div>
  }

  return (
    <div className='flex justify-center items-center my-4 '>
      <form className='formStyle w-[500px]'>
        <div className=' w-full h-auto'>
            <Image src="/images/sadhak.jpg" alt='practice' width={450} height={275}/>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <label>Class Name:</label>
          <input type='text' readOnly className='inputBox' name='prcName' value={data.prcName}   placeholder='Enter class name'/>
        </div>
        <div className='grid grid-cols-3 gap-1 w-full'>
            <div className='flex flex-col gap-2 w-full'>
                <label>Starts At:</label>
                <input type='time' readOnly className='inputBox' name='prcStartsAt' value={data.prcStartsAt} />
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Ends At:</label>
                <input type='time' readOnly className='inputBox' name='prcEndsAt' value={data.prcEndsAt}/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label>Language:</label>
                <select className='inputBox h-[46px]' name='prcLang' value={data.prcLang} disabled>
                  <option>--- Select ---</option>
                  <option  value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
            </div>
        </div>
        <div className='flex flex-col gap-2 w-full mb-2'>
          <label>Practice Days:</label>
          <div className='grid grid-cols-7 gap-1 w-full'>
          { practiceDays.map((item, index) => ( 
            <div key={index} className='flex items-center gap-2 w-full'> 
              <input 
                type='checkbox' 
                readOnly
                value={item} 
                checked={pracDays?.includes(item)}
              /> 
              <label>{item}</label> 
            </div> )) 
          }
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>WhatsApp Group Link:</label>
            <input type='text' readOnly className='inputBox' name='prcWhatLink' value={data.prcWhatLink} />
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>Meeting Link:</label>
            <input type='text' readOnly className='inputBox' name='prcLink' value={data.prcLink} />
        </div>
        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
        <div className="mt-4">
            <button type="button" className="btnLeft" onClick={() => router.push("/account/my-practice-class")}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default ViewMyPracticeClass;
