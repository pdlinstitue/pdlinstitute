import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../dbConnect';
import Users from '../../../../../modals/Users';
import { NextRequest, NextResponse } from "next/server";

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
    sdkConfPwd?: string,
    sdkImg:string,
    sdkRole:string,
    isVolunteer:string,
    createdBy?:string
}

export async function POST(req: NextRequest) {
  
  try {

    await dbConnect();
    const 
    { 
        sdkFstName,
        sdkMdlName,
        sdkLstName,
        sdkEdc,
        sdkOcp,
        sdkBthDate,
        sdkGender,
        sdkMarStts,
        sdkSpouce,
        sdkPhone,
        sdkWhtNbr,
        sdkEmail,
        sdkCountry,
        sdkState,
        sdkCity,
        sdkComAdds,
        sdkParAdds,
        sdkPwd,
        sdkConfPwd,
        sdkImg,
        sdkRole,
        isVolunteer,
        createdBy
    }: SdkType = await req.json();

    const existingEmail = await Users.findOne({ sdkEmail });
    const existingPhone = await Users.findOne({ sdkPhone });
    
    if (existingEmail) {
      return NextResponse.json({ success: false,  msg: 'Email is already registered !' }, {status:400});
    }

    if (existingPhone) {
      return NextResponse.json({ success: false,  msg: 'Phone is already registered !' }, {status:400});
    }

    if(sdkPwd && sdkConfPwd){
       if(sdkPwd !== sdkConfPwd){
        return NextResponse.json({ success: false, msg:"Password & Confirm Password does not match!" }, {status:200});
       }     
       else {
        const hashedPwd = await bcrypt.hash(sdkPwd, 12);
        const newUser = new Users({ sdkFstName,
            sdkMdlName,
            sdkLstName,
            sdkBthDate,
            sdkEdc,
            sdkOcp,
            sdkGender,
            sdkMarStts,
            sdkSpouce,
            sdkPhone,
            sdkWhtNbr,
            sdkEmail,
            sdkCountry,
            sdkState,
            sdkCity,
            sdkComAdds,
            sdkParAdds,
            sdkPwd:hashedPwd,
            sdkImg,
            sdkRole,
            isVolunteer,
            createdBy
        });
        const savedUser = await newUser.save();
  
        if(savedUser){
            return NextResponse.json({ savedUser, success: true, msg:"Registered successfully." }, {status:200});
        }else{
            return NextResponse.json({ success: false, msg:"Registration failed." }, {status:200});
        }
      }   
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