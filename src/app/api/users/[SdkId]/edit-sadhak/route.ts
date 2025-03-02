import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface ISdkParams {
    SdkId?: string;
}

type SdkType = {
    sdkFstName: string
    sdkMdlName: string
    sdkLstName: string
    sdkFthName: string 
    sdkMthName: string
    sdkAbout: string
    isMedIssue:string
    sdkMedIssue: string
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
    sdkImg:string,
    sdkRole:string,
    updatedBy?:string
}

export async function PUT(req: NextRequest, {params}:{params:ISdkParams}) {
  
  try {
    await dbConnect();
    const { sdkFstName, sdkMdlName, sdkLstName, sdkFthName, sdkMthName, sdkAbout, isMedIssue, sdkMedIssue, sdkBthDate, sdkGender, sdkMarStts, sdkSpouce, sdkPhone, sdkWhtNbr, sdkEmail, sdkComAdds, sdkParAdds, sdkPwd, sdkConfPwd, sdkImg, sdkRole, updatedBy }: SdkType = await req.json();
    const userById = await Users.findById(params.SdkId);

    if (userById.sdkEmail !== sdkEmail) {
      const existingEmail = await Users.findOne({ sdkEmail });
      if (existingEmail) {
        return NextResponse.json({ success: false,  msg: 'Email is already registered !' }, {status:400});
      }
    }

    if (userById.sdkPhone !== sdkPhone) {
      const existingPhone = await Users.findOne({ sdkPhone });
      if (existingPhone) {
        return NextResponse.json({ success: false,  msg: 'Phone is already registered !' }, {status:400});
      }
    }

    if(sdkPwd && sdkConfPwd){
       if(sdkPwd !== sdkConfPwd){
        return NextResponse.json({ success: false, msg:"Password & Confirm Password does not match!" }, {status:200});
       }     
       else {
        const hashedPwd = await bcrypt.hash(sdkPwd, 12);
        const sdkById = await Users.findByIdAndUpdate(params.SdkId, {sdkFstName, sdkMdlName, sdkLstName, sdkFthName, sdkMthName, sdkAbout, isMedIssue, sdkMedIssue, sdkBthDate, sdkGender, sdkMarStts, sdkSpouce, sdkPhone, sdkWhtNbr, sdkEmail, sdkComAdds, sdkParAdds, sdkPwd:hashedPwd,  sdkImg, sdkRole, updatedBy}, {runValidators:true});
  
        if(sdkById){
            return NextResponse.json({ sdkById, success: true, msg:"Sadhak profile updated successfully." }, {status:200});
        }else{
            return NextResponse.json({ success: false, msg:"Sadhak profile updation failed." }, {status:200});
        }
      }
    } else {
      const sdkById = await Users.findByIdAndUpdate(params.SdkId, {sdkFstName, sdkMdlName, sdkLstName, sdkFthName, sdkMthName, sdkAbout, isMedIssue, sdkMedIssue, sdkBthDate, sdkGender, sdkMarStts, sdkSpouce, sdkPhone, sdkWhtNbr, sdkEmail, sdkComAdds, sdkParAdds, sdkImg, sdkRole, updatedBy}, {runValidators:true});
      return NextResponse.json({ sdkById, success: true, msg:"Sadhak profile updated successfully." }, {status:200}); 
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