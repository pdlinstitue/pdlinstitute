"use client";
import Loading from '@/app/account/Loading';
import { StepperContext } from '@/app/context/StepperContext';
import { BASE_API_URL } from '@/app/utils/constant';
import React, { useContext, useEffect, useState } from 'react';

interface countryListProps {
 country_id:string,
 country_name:string
}

interface stateListProps {
  state_id:string,
  state_name:string
  country_iso2:string
}

interface cityListProps {
  city_id:string,
  city_name:string,
  state_iso2:number
}

const CommDetails : React.FC = () => {

  const stepperContext = useContext(StepperContext);
  
  if (!stepperContext) {
    return null; // or handle the null case appropriately
  }
  
  const {userData, setUserData} = stepperContext;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countryList, setCountryList] = useState<countryListProps[] | null>([]);
  const [stateList, setStateList] = useState<stateListProps[] | null>([]);
  const [cityList, setCityList] = useState<cityListProps[] | null>([]);
  const [isSameComm, setIsSameComm] = useState<boolean>(false);
  const [isSamePin, setIsSamePin] = useState<boolean>(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  }

  const handleSameCommToggle = () => {
    const newValue = !isSameComm;
    setIsSameComm(newValue);
    if (newValue) {
      setUserData(prev => ({
        ...prev,
        sdkComAdds: prev.sdkParAdds
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        sdkComAdds: ''
      }));
    }
  };

  const handleSamePinToggle = () => {
    const newValue = !isSamePin;
    setIsSamePin(newValue);
    if (newValue) {
      setUserData(prev => ({
        ...prev,
        sdkComPinCode: prev.sdkPinCode
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        sdkComPinCode: 0
      }));
    }
  };


  useEffect(()=>{
    async function fetchCountryList(){
      try {
        const res = await fetch(`${BASE_API_URL}/api/countries`);
        const countryData = await res.json();
        setCountryList(countryData.ctrList);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }  finally {
        setIsLoading(false);
      }
    }
    fetchCountryList();
  },[])

  useEffect(()=>{
    async function fetchStateList(){
    try{
        if (userData.sdkCountry) {
          const res = await fetch(`${BASE_API_URL}/api/states?country_name=${userData.sdkCountry}`);
          const stateData = await res.json();
          setStateList(stateData.sttList);
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStateList();
  },[userData.sdkCountry])

  useEffect(()=>{
  async function fetchCityList(){
    try{
        if (userData.sdkState) {
          const res = await fetch(`${BASE_API_URL}/api/cities?state_name=${userData.sdkState}`);
          const cityData = await res.json();
          setCityList(cityData.cityList);
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCityList();
  },[userData.sdkState])

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }
  return (
    <div>
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-3 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Country:<span className='text-red-500'>*</span></label>
            <select className='inputBox' name='sdkCountry' value={userData.sdkCountry} onChange={handleChange}>
              <option className='text-center'> --- Select --- </option>
              {
                countryList?.map((ctr:any)=>{
                  return (
                    <option key={ctr.country_id} value={ctr.country_name}>{ctr.country_name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>State:<span className='text-red-500'>*</span></label>
            <select className='inputBox' name='sdkState' value={userData.sdkState} onChange={handleChange}>
              <option className='text-center'> --- Select --- </option>
              {
                stateList?.map((stt:any)=>{
                  return (
                    <option key={stt.state_id} value={stt.state_name}>{stt.state_name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>City:<span className='text-red-500'>*</span></label>
            <select className='inputBox' name='sdkCity' value={userData.sdkCity} onChange={handleChange}>
              <option className='text-center'> --- Select --- </option>
              {
                cityList?.map((cty:any)=>{
                  return (
                    <option key={cty.city_id} value={cty.city_name}>{cty.city_name}</option>
                  )
                })
              }
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Perm Address:<span className='text-red-500'>*</span></label>
            <textarea rows={4} name='sdkParAdds' value={userData.sdkParAdds} placeholder='Permanent Address' onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Comm Address:
              <span className='text-red-500 px-3'>*</span>
              <input type='checkbox' checked={isSameComm} onChange={handleSameCommToggle} className='ml-2' />Check if same
            </label>
            <textarea rows={4} name='sdkComAdds' value={userData.sdkComAdds} placeholder='Communication Address' onChange={handleChange} className='inputBox' disabled={isSameComm} />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Pincode:<span className='text-red-500'>*</span></label>
            <input type="number" name='sdkPinCode' value={userData.sdkPinCode} placeholder='For permanent address' onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Pincode:
              <span className='text-red-500 px-3'>*</span>
              <input type='checkbox' checked={isSamePin} onChange={handleSamePinToggle} className='ml-2' />Check if same
            </label>
            <input type='number' name='sdkComPinCode' value={userData.sdkComPinCode} placeholder='For communication address' onChange={handleChange} className='inputBox' disabled={isSamePin} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommDetails;
