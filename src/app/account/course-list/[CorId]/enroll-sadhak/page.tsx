'use client';
import Loading from '@/app/account/Loading';
import React, { FormEvent, use, useEffect, useState } from 'react';
import { BASE_API_URL } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import NoBatchAdmin from '@/app/components/NoBatchAdmin';

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
  createdBy:string,
  sdkId:string,
  isApproved:string,
}

const EnrollSadhak : React.FC<IEnrollCourseParams> = ({params}) => {

  const { CorId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [payThrough, setPaythrough] = useState<string>('QR');
  const [corData, setCorData] = useState<{ [key: string]: string }>({coDon:'', coType:''});
  const [enrData, setEnrData] = useState<BatchDataProps>({enrSrnShot:'', enrTnsNo:'', corId:'', bthId:'', createdBy:'', sdkId:'', isApproved:''})
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

  const handlePayThrough = (item:any) => {
      if(item === "QR"){
        setPaythrough('QR');
      } else {
        setPaythrough('CCA');
      }
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
    setIsSaving(true);
    try 
      {
        const response = await fetch(`${BASE_API_URL}/api/enrollments`, {
          method: 'POST',
          body: JSON.stringify({
            enrTnsNo:enrData.enrTnsNo,
            enrSrnShot:bthData.enrSrnShot,
            bthId: enrData.bthId,
            corId: CorId,
            sdkId: enrData.sdkId,
            isApproved: "Approved",
            createdBy: loggedInUser.result?._id,
          }),
        });
    
        const post = await response.json();
    
        if (post.success === false) {
            toast.error(post.msg);
        } else {
          if(payThrough==="CCA"){
            handlePayment(post.savedEnr._id);
          } else{
            toast.success(post.msg);
            router.push('/account/course-list');
          }
        }
      } catch (error) {
          toast.error('Error enrolling batch.');
        } finally {
          setIsSaving(false);
        }
      };

    const handlePayment = async (enrId: any) => { 
      const response = await fetch(`/api/payment?enrId=${enrId}&corId=${CorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: `ORD${Date.now()}`,
          amount: corData.coDon,
          customer_email: "test@example.com",
          customer_phone: "9876543210",
        }),
      });
    
      const data = await response.json();
    
      if (data.encryptedData) {
        // Create form & submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const encInput = document.createElement("input");
      encInput.type = "hidden";
      encInput.name = "encRequest";
      encInput.value = data.encryptedData;
      form.appendChild(encInput);

      const accessInput = document.createElement("input");
      accessInput.type = "hidden";
      accessInput.name = "access_code";
      accessInput.value = data.accessCode;
      form.appendChild(accessInput);

      document.body.appendChild(form);
      form.submit();

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
      {!batchList ? (
          <NoBatchAdmin CourseId={CorId} />
        ) : ( 
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
                 
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">BANK DETAILS:</label>
                      <p>{bthData.bthBank}</p>
                    </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">TRANSN NO:</label>
                      <input type="text" name='enrTnsNo' value={enrData.enrTnsNo} onChange={handleChange} className="inputBox h-[48px]" placeholder='Enter transaction no.' />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold">UPLOAD SCREENSHOT:</label>
                      <input type="file" name='enrScnShot' className="inputBox" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">SDK ID:</label>
                    <input type="text" name='sdkId' value={enrData.sdkId} onChange={handleChange} className="inputBox h-[48px]" placeholder='Enter transaction no.' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='font-semibold'>PAY THROUGH:</label>
                    <div className='flex gap-2'>
                      <input type='radio' name='payThrough'  onClick={()=>handlePayThrough('QR')} defaultChecked/>QR Code
                      <input type='radio' name='payThrough' onClick={()=>handlePayThrough('CCA')} />CCAvenue
                    </div>
                  </div>
                  {
                    payThrough === "QR" && (
                      <div className="flex flex-col gap-2">
                        <label className="font-bold">QR CODE:</label>
                        <p>{bthData.bthQr}</p>
                      </div>
                    )
                  }
                  {/* {
                    payThrough === "CCA" && (
                      <button type="button" className="py-2 px-2 bg-gray-200 hover:bg-gray-300 rounded-sm italic" onClick={handlePayment}>
                          Pay through CCAvenue
                      </button>
                    )
                  }                  */}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button type="submit" className="btnLeft" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.push("/account/course-list")}
              >
                BACK
              </button>
            </div>
          </form>
        )};
      </div>
    </div>
  );
}  

export default EnrollSadhak;