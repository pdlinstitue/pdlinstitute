import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

type SdkType = {
    sdkRegPwd: string,
    sdkRegPwdExpiry:string,
    updatedBy?:string
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ SdkId: string }> }) {
  
  try {
    await dbConnect();
    const { SdkId } = await params;
    const { sdkRegPwd, sdkRegPwdExpiry, updatedBy }: SdkType = await req.json();
    const userById = await Users.findById(SdkId);

    if (userById){
        const sdkById = await Users.findByIdAndUpdate(SdkId, {sdkRegPwd, sdkRegPwdExpiry, updatedBy}, {runValidators:true});
        return NextResponse.json({ sdkById, success: true, msg:"Re-generate password saved successfully." }, {status:200});   
    } else {
        return NextResponse.json({ success: false, msg:"No Sadhak Found." }, {status:200}); 
    }  
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving regPwd: " + error, {status: 400});
    }
  }
}