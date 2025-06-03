import React, { createContext, Dispatch, SetStateAction } from "react";
interface UserDataProps {
  sdkFstName: string, 
  sdkMdlName:string,
  sdkLstName: string, 
  sdkBthDate: string, 
  sdkGender: string, 
  sdkMarStts: string, 
  sdkSpouce: string | undefined, 
  sdkRefName: string;
  sdkRefCont: string;
  sdkCountry:string,
  sdkState:string,
  sdkCity:string,
  sdkComAdds:string,
  sdkParAdds:string,
  sdkWhtNbrCntCode: string,
  sdkWhtNbr: string, 
  sdkPhoneCntCode: string,
  sdkPhone: string, 
  sdkEmail: string, 
  sdkPinCode: number,
  sdkComPinCode: number,
  sdkPwd: string, 
  sdkConfPwd: string,
  sdkPhoneOtp:string, 
  sdkEmailOtp:string,
  sdkPhoneSentOtp:string, 
  sdkEmailSentOtp:string,
  sdkOtpVerified:boolean,
  isPhoneValid:boolean,
  isEmailValid:boolean
}
interface StepperContextProps {
  userData: UserDataProps;
  setUserData: React.Dispatch<React.SetStateAction<UserDataProps>>;
  finalData: any[];
  setFinalData: React.Dispatch<React.SetStateAction<any[]>>;
  setErrorMessage:React.Dispatch<string>;
}
export const StepperContext = createContext<StepperContextProps | null>(null);
  