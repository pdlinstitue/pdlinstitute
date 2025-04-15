import Users from "../../../../../modals/Users";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Countries from "../../../../../modals/Countries";
import States from "../../../../../modals/States";

type SdkType = {
  sdkRegNo?: string;
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkBthDate: Date;
  sdkGender: string;
  sdkMarStts: string;
  sdkSpouce: string;
  sdkPhone: string;
  sdkWhtNbr: string;
  sdkEmail: string;
  sdkCountry: string;
  sdkState: string;
  sdkCity: string;
  sdkPinCode:number;
  sdkComPinCode:number
  sdkComAdds: string;
  sdkParAdds: string;
  sdkPwd: string;
  sdkConfPwd?: string;
  isActive: boolean;
  sdkImg: string;
  sdkRole: string;
  createdBy?: string;
};

async function generateCustomId(country: any, state: any) {

  const lastUser = await Users.findOne().sort({ createdAt: -1 });
  let serialNumber = 12; // Default starting number

  if (lastUser && lastUser.sdkRegNo) {
    const lastSerial = parseInt(lastUser.sdkRegNo.split("-").pop(), 10);
    serialNumber = lastSerial + 1;
  }

  const formattedSerial = serialNumber.toString().padStart(6, "0");  
  return `PDL-0001-${country.country_iso2}-${state.state_iso2}-${formattedSerial}`;
}

export async function POST(req: NextRequest) {
  
  try {
    await dbConnect();
    const {
      sdkFstName,
      sdkMdlName,
      sdkLstName,
      sdkBthDate,
      sdkGender,
      sdkMarStts,
      sdkSpouce,
      sdkPhone,
      sdkWhtNbr,
      sdkEmail,
      sdkPinCode,
      sdkComPinCode,
      sdkCountry,
      sdkState,
      sdkCity,
      sdkComAdds,
      sdkParAdds,
      sdkPwd,
      sdkConfPwd,
      sdkImg,
      sdkRole,
      createdBy,
    }: SdkType = await req.json();

    const existingEmail = await Users.findOne({ sdkEmail });
    const existingPhone = await Users.findOne({ sdkPhone });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, msg: "Email is already registered!" },
        { status: 400 }
      );
    }
    if (existingPhone) {
      return NextResponse.json(
        { success: false, msg: "Phone is already registered!" },
        { status: 400 }
      );
    }

    if (sdkPwd !== sdkConfPwd) {
      return NextResponse.json(
        { success: false, msg: "Password & Confirm Password do not match!" },
        { status: 400 }
      );
    }

    if ( sdkPwd && sdkPwd.length < 8) {
      return NextResponse.json(
        { success: false, msg: 'Password must be at least 8 chars long.' }, 
        { status: 400 });
    }
    
    if ( sdkConfPwd && sdkConfPwd.length < 8) {
      return NextResponse.json(
        { success: false, msg: 'Confirm Password must be at least 8 chars long.' },
        { status: 400 });
    }
    
    const hashedPwd = await bcrypt.hash(sdkPwd, 12);
    const country = await Countries.findOne({country_id:sdkCountry});
    const state = await States.findOne({state_id:sdkState});
    const customId = await generateCustomId(country, state);

    const newUser = new Users({
      sdkRegNo: customId,
      sdkFstName,
      sdkMdlName,
      sdkLstName,
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
      sdkPinCode,
      sdkComPinCode,
      sdkComAdds,
      sdkParAdds,
      sdkPwd: hashedPwd,
      sdkImg,
      sdkRole,
      createdBy,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      return NextResponse.json(
        { savedUser, success: true, msg: "Registered successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, msg: "Registration failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: `Error while saving user data: ${error}` },
      { status: 400 }
    );
  }
}
