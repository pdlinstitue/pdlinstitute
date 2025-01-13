import { createContext, Dispatch, SetStateAction } from "react";

interface StepperContextType {

  userData: { [key: string]: string };
  
  setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  
  finalData: any[];
  
  setFinalData: Dispatch<SetStateAction<any[]>>;
  
  }
  
  export const StepperContext = createContext<StepperContextType | null>(null);
  