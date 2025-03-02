import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

interface ISdkParams {
    SdkId?: string;
}

type SdkType = {
    sdkPhone: string,
    sdkWhtNbr: string,
    sdkEmail: string,
}

export async function PUT(req: NextRequest, {params}:{params:ISdkParams}) {
  
    try {
      await dbConnect();
      const { sdkPhone, sdkWhtNbr, sdkEmail }: SdkType = await req.json();
      const sdkById = await Users.findByIdAndUpdate(params.SdkId, {sdkPhone, sdkWhtNbr, sdkEmail}, {runValidators:true});
      return NextResponse.json({ sdkById, success: true, msg:"Contact updated successfully." }, {status:200});     
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving usrData: " + error, {status: 400});
      }
    }
}