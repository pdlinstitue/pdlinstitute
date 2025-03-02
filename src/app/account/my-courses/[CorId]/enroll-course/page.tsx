'use client';
import Loading from '@/app/account/Loading';
import React, { FormEvent, use, useEffect, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import NoBatch from '@/app/components/NoBatch';

interface IEnrollCourseParams {
  params: Promise<{
    CorId: string
  }>;
}

interface BatchListProps {
  _id: string;
  bthName: string;
}

interface BatchDataProps {
  enrTnsNo:string,
  enrSrnShot:string,
  corId:string,
  bthId:string,
  usrId?:string,
}

const EnrollCourse : React.FC<IEnrollCourseParams> = ({params}) => {

  const { CorId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [corData, setCorData] = useState<{ [key: string]: string }>({coDon:'', coType:''});
  const [enrData, setEnrData] = useState<BatchDataProps>({enrSrnShot:'', enrTnsNo:'', corId:'', bthId:'', usrId:''})
  const [bthData, setBthData] = useState<{ [key: string]: string }>({id: '', bthBank:'', bthQr:''});
  const [batchList, setBatchList] = useState<BatchListProps[] | null>([]);

  const loggedInUser = {
    result:{
      _id:Cookies.get("loggedInUserId"), 
      usrName:Cookies.get("loggedInUserName"),
      usrRole:Cookies.get("loggedInUserRole"),
    }
  }; 

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setEnrData((prev)=>{
      return {
        ...prev, [name]:value
      }
    });
  }

  useEffect(() => {
  async function fetchBatchesByCoId() {
    try {
      const response = await fetch(`${BASE_API_URL}/api/my-courses/${CorId}/view-batch`);
      const data = await response.json();
      setBatchList(data.bthListByCourseId);
    } catch (error) {
      console.error('Error fetching batches by course id: ', error);
    } finally {
      setIsLoading(false);
    } 
  } 
  fetchBatchesByCoId();
  }, []);

  useEffect(() => {
  async function fetchBatchDataById() {
  if(enrData.bthId) {
      try {
        const res = await fetch(`${BASE_API_URL}/api/batches/${enrData.bthId}/view-batch`);
        const bthDetails = await res.json();
        setBthData(bthDetails.bthById);
      } catch (error) {
        console.error('Error fetching bthData by id: ', error);
      } finally {
        setIsLoading(false);
      } 
    }
  } 
  fetchBatchDataById();
  },[enrData.bthId]);

  useEffect(() => {
  async function fetchCourseById() {
    try {
      const res = await fetch(`${BASE_API_URL}/api/courses/${CorId}/view-course`);
      const courseData = await res.json();
      setCorData(courseData.corById);
    } catch (error) {
      console.error('Error fetching corData by id: ', error);
    } finally {
      setIsLoading(false);
    } 
  } 
  fetchCourseById();
  },[]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();   
  try 
    {
      const response = await fetch(`${BASE_API_URL}/api/enrollments`, {
        method: 'POST',
        body: JSON.stringify({
          enrTnsNo:enrData.enrTnsNo,
          enrSrnShot:bthData.enrSrnShot,
          bthId: enrData.bthId,
          corId: CorId,
          createdBy: loggedInUser.result?._id,
        }),
      });
  
      const post = await response.json();
   
      if (post.success === false) {
          toast.error(post.msg);
      } else {
          toast.success(post.msg);
          router.push('/account/my-courses');
        }
      } catch (error) {
        toast.error('Error enrolling batch.');
      } 
    };

  if(isLoading) {
    return <div>
      <Loading />
    </div>
  }
  return (
    <div>
      <div>
        {batchList && batchList.length > 0 ? (
          <form className={`formStyle w-[600px] mx-auto my-24`} onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-center text-orange-600 italic">
                Enroll Batch
              </h1>
              <select
                className="inputBox"
                name="bthId"
                value={enrData.bthId}
                onChange={handleChange}
              >
                <option value="" className="text-center">
                  --- Select Batch ---
                </option>
                {batchList.map((bth: any) => (
                  <option key={bth._id} value={bth._id}>
                    {bth.bthName}
                  </option>
                ))}
              </select>
              {bthData.id !== "" && (
                <div className="flex flex-col gap-3">
                  <div className='flex p-2 bg-gray-200 items-center justify-center gap-4'>
                    <span className='font-bold'>DONATION:</span>
                    <p>{corData.coDon ? corData.coDon : corData.coType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">BANK DETAILS:</label>
                      <p>{bthData.bthBank}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">QR CODE:</label>
                      <p>{bthData.bthQr}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">TRANSACTION NO.</label>
                      <input type="text" name='enrTnsNo' value={enrData.enrTnsNo} onChange={handleChange} className="inputBox h-[48px]" placeholder='Enter transaction no.' />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">UPLOAD SCREENSHOT</label>
                      <input type="file" name='enrScnShot' className="inputBox" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-4">
              <button type="submit" className="btnLeft">
                SUBMIT
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.push("/account/my-courses")}
              >
                BACK
              </button>
            </div>
          </form>
        ) : (
          <NoBatch CourseId={CorId}/>
        )}
      </div>
    </div>
  );
}  

export default EnrollCourse;
