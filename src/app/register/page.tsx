"use client"
import React, { useState } from 'react'
import Stepper from '../components/registration/Stepper';
import StepperControl from '../components/registration/StepperControl';
import PersonalDetails from '../components/registration/PersonalDetails';
import CommDetails from '../components/registration/CommDetails';
import ContactDetails from '../components/registration/ContactDetails';
import UploadDocs from '../components/registration/UploadDocs';
import CreatePass from '../components/registration/CreatePass';
import {StepperContext} from '../context/StepperContext';
import NavMenu from '../components/navbar/navBar';


const Register = () => {

  const [currentStep, setCurrentStep] = useState(1); 
  const [userData, setUserData] = useState<{ [key: string]: string }>({});
  const [finalData, setFinalData] = useState<any[]>([]);

  const steps : string[]  = [
    "Personal Details",
    "Contact Details",
    "Address Details",
    "Upload Docs",
    "Create Password"
  ];

  const displayStep = (step: any) => {
    switch(step){
        case 1:
            return <PersonalDetails/>
        case 2:
            return <ContactDetails/>
        case 3:
            return <CommDetails/>
        case 4:
            return <UploadDocs/>
        case 5:
            return <CreatePass/>
        default:
    }
  }

  const handleClick = (direction: any) => {
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    if(newStep > 0 && newStep <= 5) {
      setCurrentStep(newStep);
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
            <div className='my-10 p-10'>
              <StepperContext.Provider value={{userData, setUserData, finalData, setFinalData}}>
                {displayStep(currentStep)}
              </StepperContext.Provider>
            </div>                          
              <StepperControl  
                handleClick={handleClick}
                currentStep={currentStep}
              />            
          </div>
        </div>
    </div>
    </div>
  )
}

export default Register;
