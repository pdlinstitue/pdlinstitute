import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface ISdkParams {
    SdkId?: string;
}

type SdkType = {
    sdkPwd: string,
    sdkNewPwd: string,
    sdkConfPwd: string
    updatedBy?:string
}

export async function PUT(req: NextRequest, {params}:{params:ISdkParams}) {
  
  try {
    await dbConnect();
    const { sdkPwd, sdkNewPwd, sdkConfPwd, updatedBy }: SdkType = await req.json();
    const sdkById = await Users.findById(params.SdkId);

    // Check if the old password matches
    const isMatch = await bcrypt.compare(sdkPwd, sdkById.sdkPwd);
    if (!isMatch) {
      return NextResponse.json({ success: false, msg: "Old password does not match." }, {status: 400});
    }

    // Check if the new password and confirm password are the same
    if (sdkNewPwd !== sdkConfPwd) {
      return NextResponse.json({ success: false, msg: "New password and confirm password do not match." }, {status: 400});
    }

    // Hash the new password
    const hashedNewPwd = await bcrypt.hash(sdkNewPwd, 12);

    // Update the password
    sdkById.sdkPwd = hashedNewPwd;
    sdkById.updatedBy = updatedBy;
    await sdkById.save();
    return NextResponse.json({ sdkById, success: true, msg:"Password changed successfully." }, {status:200});

  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving usrData: " + error, {status: 400});
    }
  }
}
