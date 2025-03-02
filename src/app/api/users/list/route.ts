import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

type SdkType = {
    sdkFstName: string
    sdkMdlName: string
    sdkLstName: string
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
    sdkConfPwd?: string,
    isActive:boolean,
    sdkImg:string,
    sdkRole:string,
    createdBy?:string
}


export async function GET () {
  try 
  {
    await dbConnect();
    const sdkList:SdkType[] = await Users.find();
    const activeSdkList = sdkList.filter((item:any)=> item.isActive === true);
    return NextResponse.json({ activeSdkList, success: true }, {status:200});

  } catch (error:any) {
    return NextResponse.json({ error: "Error while fetching sadhakData: " + error.message }, { status: 500 });
  }
}