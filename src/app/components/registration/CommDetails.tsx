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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  }

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
          const res = await fetch(`${BASE_API_URL}/api/states?country_id=${userData.sdkCountry}`);
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
          const res = await fetch(`${BASE_API_URL}/api/cities?state_id=${userData.sdkState}`);
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
            <label>Country:*</label>
            <select className='inputBox' name='sdkCountry' value={userData.sdkCountry} onChange={handleChange}>
              <option className='text-center'> --- Select --- </option>
              {
                countryList?.map((ctr:any)=>{
                  return (
                    <option key={ctr.country_id} value={ctr.country_id}>{ctr.country_name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>State:*</label>
            <select className='inputBox' name='sdkState' value={userData.sdkState} onChange={handleChange}>
              <option className='text-center'> --- Select --- </option>
              {
                stateList?.map((stt:any)=>{
                  return (
                    <option key={stt.state_id} value={stt.state_id}>{stt.state_name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>City:*</label>
            <select className='inputBox' name='sdkCity' value={userData.sdkCity} onChange={handleChange}>
              <option className='text-center'> --- Select --- </option>
              {
                cityList?.map((cty:any)=>{
                  return (
                    <option key={cty.city_id} value={cty.city_id}>{cty.city_name}</option>
                  )
                })
              }
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Permanent Address:*</label>
            <textarea rows={4} name='sdkParAdds' value={userData.sdkParAdds} onChange={handleChange} className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Communication Address:*</label>
            <textarea rows={4} name='sdkComAdds' value={userData.sdkComAdds} onChange={handleChange} className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommDetails;
