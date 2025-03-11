import { NextRequest, NextResponse } from "next/server";
import Attendance from "../../../../../../../modals/Attendance";
import dbConnect from "../../../../../../../dbConnect";

interface IAttdParams {
    BthId:string,
    ClsId:string,
    SdkId:string
}

type AttdType = {
    status:string,
    absRemarks:string,
    markedBy:string
}

export async function POST(req: NextRequest, {params}:{params:IAttdParams}) {
  
    try {
  
      await dbConnect();
      const { status, absRemarks, markedBy }: AttdType = await req.json();
  
      const newAttd = new Attendance({bthId:params.BthId, clsId:params.ClsId, sdkId:params.SdkId, status, absRemarks, markedBy});
      const savedAttd = await newAttd.save();

      if(savedAttd){
        return NextResponse.json({ savedAttd, success: true, msg:"Marked successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedAttd, success: false, msg:"Marking failed." }, {status:200});
      }
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving attdData: " + error, {status: 400});
      }
    }
}

