import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
 
interface ISdkParams {
    SdkId?: string;
}

type SdkType = {
    sdkRegPwd: string,
    sdkRegPwdExpiry:string,
    updatedBy?:string
}

export async function PUT(req: NextRequest, {params}:{params:ISdkParams}) {
  
  try {
    await dbConnect();
    const { sdkRegPwd, sdkRegPwdExpiry, updatedBy }: SdkType = await req.json();
    const userById = await Users.findById(params.SdkId);

    if (userById){
        const sdkById = await Users.findByIdAndUpdate(params.SdkId, {sdkRegPwd, sdkRegPwdExpiry, updatedBy}, {runValidators:true});
        return NextResponse.json({ sdkById, success: true, msg:"Re-generate password saved successfully." }, {status:200});   
    } else {
        return NextResponse.json({ success: false, msg:"No user found." }, {status:200}); 
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