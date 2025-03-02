import { createContext, Dispatch, SetStateAction } from "react";
interface UserDataProps {
  sdkFstName: string, 
  sdkMdlName:string,
  sdkLstName: string, 
  sdkBthDate: string, 
  sdkGender: string, 
  sdkMarStts: string, 
  sdkSpouce: string | undefined, 
  sdkCountry:string,
  sdkState:string,
  sdkCity:string,
  sdkComAdds:string,
  sdkParAdds:string,
  sdkWhtNbr: string, 
  sdkPhone: string, 
  sdkEmail: string, 
  sdkPwd: string, 
  sdkConfPwd: string 
}
interface StepperContextProps {
  userData: UserDataProps;
  setUserData: React.Dispatch<React.SetStateAction<UserDataProps>>;
  finalData: any[];
  setFinalData: React.Dispatch<React.SetStateAction<any[]>>;
}
export const StepperContext = createContext<StepperContextProps | null>(null);
  