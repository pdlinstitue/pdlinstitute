import Users from "../../../../modals/Users";
import dbConnect from "../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyApiToken } from "@/app/utils/auth";

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

export async function GET (req: NextRequest) {
  try 
  {
    
    await verifyApiToken();
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const usrRole = searchParams.get("usrRole");
    let InActiveSdkList:SdkType[] = await Users.find({isActive: false});

    if (usrRole && usrRole === "Admin") {
      // Filter out Admin and Super-Admin roles for Admin users
      InActiveSdkList = InActiveSdkList.filter(
        (sdk: SdkType) => sdk.sdkRole !== "Admin" && sdk.sdkRole !== "Super-Admin"
      );
    }

    return NextResponse.json({ InActiveSdkList, success: true }, {status:200});

  } catch (error:any) {
    return NextResponse.json({ error: "Error while fetching sadhakData: " + error.message }, { status: 500 });
  }
}