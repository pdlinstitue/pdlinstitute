import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import {NextResponse } from "next/server";

type SdkType = {
    sdkFstName: string
    sdkMdlName: string
    sdkLstName: string
    sdkEdc:string,
    sdkOcp:string,
    sdkBthDate: Date
    sdkGender: string
    sdkMarStts: string
    sdkSpouce: string
    sdkPhone: string,
    sdkWhtNbr: string,
    sdkEmail: string,
    sdkCountry: string,
    sdkState: string,
    sdkCity: string,
    sdkComAdds: string,
    sdkParAdds: string,
    sdkPwd: string,
    isActive:boolean,
    sdkImg:string,
    sdkRole:string,
    createdBy?:string
}


export async function GET () {
  
  try 
  {
    await dbConnect();
    const activeSdkList:SdkType[] = await Users.find({isActive: true})
    .sort({createdAt:-1});

    return NextResponse.json({ activeSdkList, success: true }, {status:200});

  } catch (error:any) {
    return NextResponse.json({ error: "Error while fetching sadhakData: " + error.message }, { status: 500 });
  }
}