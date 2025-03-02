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
    const sdkList:SdkType[] = await Users.find();
    const InActiveSdkList = sdkList.filter((item:any)=> item.isActive === false);
    return NextResponse.json({ InActiveSdkList, success: true }, {status:200});

  } catch (error:any) {
    return NextResponse.json({ error: "Error while fetching sadhakData: " + error.message }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
  
//     try {
  
//       await dbConnect();
//       const { sdkFstName, sdkMdlName, sdkLstName, sdkBthDate, sdkGender, sdkMarStts, sdkSpouce, sdkPhone, sdkWhtNbr, sdkEmail, sdkComAdds, sdkParAdds, sdkPwd, sdkConfPwd, sdkImg, sdkRole }: SdkType = await req.json();
  
//       if(sdkPwd !== sdkConfPwd){
//             return NextResponse.json({ success: false, msg:"Password & Confirm Password does not match!" }, {status:200});
//       } else {
//         const newUser = new Users({ sdkFstName, sdkMdlName, sdkLstName, sdkBthDate, sdkGender, sdkMarStts, sdkSpouce, sdkPhone, sdkWhtNbr, sdkEmail, sdkComAdds, sdkParAdds, sdkPwd, sdkImg, sdkRole});
//         const savedUser = await newUser.save();

//         if(savedUser){
//             return NextResponse.json({ savedUser, success: true, msg:"Registration successful." }, {status:200});
//         }else{
//             return NextResponse.json({ success: false, msg:"Registration failed." }, {status:200});
//         }
//       }

//     } catch (error:any) {
//       if (error.name === 'ValidationError') {
//         const messages = Object.values(error.errors).map((val:any) => val.message);
//         return NextResponse.json({ success: false, msg: messages }, {status:400});
//       }else{
//         return new NextResponse ("Error while saving usrData: " + error, {status: 400});
//       }
//     }
// }