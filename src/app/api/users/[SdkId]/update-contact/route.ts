import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

type SdkType = {
    sdkPhone: string,
    sdkWhtNbr: string,
    sdkEmail: string,
    updatedBy?: string
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ SdkId: string }> }) {
  
  try {
    await dbConnect();
    const { SdkId } = await params;
    const { sdkPhone, sdkWhtNbr, sdkEmail, updatedBy }: SdkType = await req.json();

    if(!SdkId){
      return NextResponse.json({success:false, msg: "No Sadhak found." }, { status: 404 });
    } else {
      const sdkById = await Users.findByIdAndUpdate(SdkId, {sdkPhone, sdkWhtNbr, sdkEmail, updatedBy}, {runValidators:true});
      return NextResponse.json({ sdkById, success: true, msg:"Contact updated successfully." }, {status:200});
    }     
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving usrData: " + error, {status: 400});
    }
  }
}