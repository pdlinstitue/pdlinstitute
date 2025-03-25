import Users from "../../../../modals/Users";
import dbConnect from "../../../../dbConnect";
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
    sdkComAdds: string,
    sdkParAdds: string,
    sdkPwd: string,
    sdkConfPwd?: string,
    isActive:boolean,
    sdkImg:string,
    sdkRole:string,
}

export async function GET () {
  try 
  {
    await dbConnect();
    const InActiveSdkList:SdkType[] = await Users.find({isActive: false});
    return NextResponse.json({ InActiveSdkList, success: true }, {status:200});

  } catch (error:any) {
    return NextResponse.json({ error: "Error while fetching sadhakData: " + error.message }, { status: 500 });
  }
}