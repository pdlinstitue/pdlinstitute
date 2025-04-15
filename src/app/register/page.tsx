"use client";
import React, { useState } from 'react';
import Stepper from '../components/registration/Stepper';
import StepperControl from '../components/registration/StepperControl';
import PersonalDetails from '../components/registration/PersonalDetails';
import CommDetails from '../components/registration/CommDetails';
import ContactDetails from '../components/registration/ContactDetails';
import CreatePass from '../components/registration/CreatePass';
import {StepperContext} from '../context/StepperContext';
import NavMenu from '../components/navbar/navBar';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '../utils/constant';

interface UserDataProps {

  sdkRegNo?: string;
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkBthDate: string;
  sdkGender: string;
  sdkMarStts: string;
  sdkSpouce: string | undefined;
  sdkWhtNbr: string;
  sdkPhone: string;
  sdkEmail: string;
  sdkCountry: string;
  sdkState: string;
  sdkCity: string;
  sdkPinCode:number;
  sdkComPinCode:number;
  sdkComAdds: string;
  sdkParAdds: string;
  sdkPwd: string;
  sdkConfPwd: string;
  sdkPhoneOtp:string; 
  sdkEmailOtp:string;
}

const Register = () => {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); 
  const [userData, setUserData] = useState<UserDataProps>({
    sdkFstName: "",
    sdkMdlName:"",
    sdkLstName: "",
    sdkBthDate: "",
    sdkGender: "",
    sdkMarStts: "",
    sdkSpouce: "",
    sdkWhtNbr: "",
    sdkPhone: "",
    sdkEmail: "",
    sdkPinCode: 0,
    sdkComPinCode: 0,
    sdkCountry:"",
    sdkState:"",
    sdkCity:"",
    sdkComAdds:"",
    sdkParAdds:"",
    sdkPwd: "",
    sdkConfPwd: "",
    sdkPhoneOtp:"", 
  sdkEmailOtp:"",
  });
  const [finalData, setFinalData] = useState<any[]>([]);
  const [errorMessage,setErrorMessage] = useState<string>("");

  const steps : string[]  = [
    "Personal Details",    
    "Address Details",
    "Contact Details",
    "Create Password"
  ];

  const displayStep = (step: any) => {
    switch(step){
        case 1:
          return <PersonalDetails/>
        case 2:
          return <CommDetails/>            
        case 3:
          return <ContactDetails/>
        case 4:
            return <CreatePass/>
        default:
    }
  }

  const validateInput = (step:any) => {
    setErrorMessage("");
    if(step === 1){
      if(!userData || !("sdkFstName" in userData) || userData.sdkFstName === null || userData.sdkFstName.trim() === ""){
        setErrorMessage("First name is required.");
        return false;
      } else if ( !userData || !("sdkLstName" in userData) || userData.sdkLstName === null || userData.sdkLstName.trim() === ""){
        setErrorMessage("Last name is required.");
        return false;
      } else if ( !userData || !("sdkBthDate" in userData) || userData.sdkBthDate === null || userData.sdkBthDate.trim() === ""){
        setErrorMessage("DOB name is required.");
        return false;
      }else if ( !userData || !("sdkGender" in userData) || userData.sdkGender === null || userData.sdkGender.trim() === ""){
        setErrorMessage("Gender is required.");
        return false;
      }else if ( !userData || !("sdkMarStts" in userData) || userData.sdkMarStts === null || userData.sdkMarStts.trim() === ""){
        setErrorMessage("Marital status is required.");
        return false;
      }
    }else if(step === 2){   
      if(!userData || !("sdkCountry" in userData) || userData.sdkCountry === null || userData.sdkCountry.trim() === ""){
        setErrorMessage("Country is required.");
        return false;
      }
      if(!userData || !("sdkState" in userData) || userData.sdkState === null || userData.sdkState.trim() === ""){
        setErrorMessage("State is required.");
        return false;
      }
      if(!userData || !("sdkCity" in userData) || userData.sdkCity === null || userData.sdkCity.trim() === ""){
        setErrorMessage("City is required.");
        return false;
      }
      if(!userData || !("sdkParAdds" in userData) || userData.sdkParAdds === null || userData.sdkParAdds.trim() === ""){
        setErrorMessage("Permanent address is must.");
        return false;
      }
      if(!userData || !("sdkComAdds" in userData) || userData.sdkComAdds === null || userData.sdkComAdds.trim() === ""){
        setErrorMessage("Communication address is must.");
        return false;
      }
      if(!userData || !("sdkPinCode" in userData) || userData.sdkPinCode === null){
        setErrorMessage("Pincode for permanent address is must.");
        return false;
      }
      if(!userData || !("sdkComPinCode" in userData) || userData.sdkComPinCode === null){
        setErrorMessage("Pincode for communication address is must");
        return false;
      }
    } else if(step === 3){   
      if(!userData || !("sdkWhtNbr" in userData) || userData.sdkWhtNbr === null || userData.sdkWhtNbr.trim() === ""){
        setErrorMessage("Whatsapp number is required.");
        return false;
      }
      if(!userData || !("sdkPhone" in userData) || userData.sdkPhone === null || userData.sdkPhone.trim() === ""){
        setErrorMessage("Phone number is required.");
        return false;
      }
      if(!userData || !("sdkEmail" in userData) || userData.sdkEmail === null || userData.sdkEmail.trim() === ""){
        setErrorMessage("Email is required.");
        return false;
      }
    } else if(step === 4){   
      if(!userData || !("sdkPwd" in userData) || userData.sdkPwd === null || userData.sdkPwd.trim() === ""){
        setErrorMessage("Password is required.");
        return false;
      }
      if(!userData || !("sdkConfPwd" in userData) || userData.sdkConfPwd === null || userData.sdkConfPwd.trim() === ""){
        setErrorMessage("Confirm password is required.");
        return false;
      }
    }
    return true;
  }

  const handleClick = async (direction: any) => {
    console.log(userData);
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    let isValidForm = validateInput(currentStep);
    if(newStep > 0 && newStep <= 4) {
      if(direction === "next"){      
        if(isValidForm)
        {
          setCurrentStep(newStep);
        }
      }
      else{
        setCurrentStep(newStep);
      }
    } else if(currentStep === 4){
      if(isValidForm){
      try 
      {
          const response = await fetch(`${BASE_API_URL}/api/users/register`, {
            method: 'POST',
            body: JSON.stringify({
              sdkFstName: userData.sdkFstName,
              sdkMdlName: userData.sdkMdlName,
              sdkLstName: userData.sdkLstName,
              sdkBthDate: userData.sdkBthDate,
              sdkGender: userData.sdkGender,
              sdkMarStts: userData.sdkMarStts,
              sdkSpouce: userData.sdkSpouce,
              sdkPhone: userData.sdkPhone,
              sdkWhtNbr: userData.sdkWhtNbr,
              sdkEmail: userData.sdkEmail,
              sdkCountry:userData.sdkCountry,
              sdkState:userData.sdkState,
              sdkCity:userData.sdkCity,
              sdkComAdds: userData.sdkComAdds,
              sdkParAdds: userData.sdkParAdds,
              sdkPinCode: userData.sdkPinCode,
              sdkComPinCode: userData.sdkComPinCode,
              sdkPwd: userData.sdkPwd,
              sdkConfPwd: userData.sdkConfPwd,
            }),
          });
      
          const user = await response.json();
          console.log(user);
      
          if (user.success === false) {
              toast.error(user.msg);
          } else {
              toast.success(user.msg);
              router.push(`/registration-success?sdkRegNo=${user.savedUser.sdkRegNo}`);
          }
      } catch (error) {
          toast.error('Error while registering.');
      } 
    }
    }
  }

  return (
    <div>
      <NavMenu/>
      <div className='flex justify-center items-center my-20'>
        <div className='md:w-1/2 mx-auto shadow-xl rounded-md pb-2 border-[1px] border-orange-500'>
          <div className='px-12 pt-12'>
            <Stepper 
                steps={steps}
                currentStep={currentStep}
            />
            <div className='mb-6 mt-10'>
              <StepperContext.Provider value={{userData, setUserData, finalData, setFinalData}}>
                {displayStep(currentStep)}
              </StepperContext.Provider>
            </div>               
            <p className='text-sm text-red-600 italic'>{errorMessage}</p>           
              <StepperControl  
                handleClick={handleClick}
                currentStep={currentStep}
                steps={steps}
              /> 
          </div>
        </div>
    </div>
    </div>
  )
}

export default Register;
