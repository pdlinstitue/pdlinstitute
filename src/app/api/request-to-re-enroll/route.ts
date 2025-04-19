import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Reenrollments from "../../../../modals/Reenrollments";

type ReenrollmentsType = {
  corId: string;
  reqBy: string;
  reqReason: string;
}

export async function GET(req:NextRequest){

  try {
    
    await dbConnect();
    const reqList:ReenrollmentsType[] = await Reenrollments.find({isActive:true})
    .populate('corId', 'coNick')
    .populate('reqBy', 'sdkFstName sdkLastName sdkRegNo sdkPhone');

    if(reqList && reqList.length > 0){
        return NextResponse.json({ reqList, success: true }, {status:200});
    }else {
        return NextResponse.json({ msg: "No active reenrollment requests found", success: false }, { status: 404 });
    }  
      
  } catch (error:any) {
    return new NextResponse("Error while fetching reenrollment requests: " + error, {status:500});
  }
}

export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { corId, reqBy, reqReason }: ReenrollmentsType = await req.json();
  
      const newReq = new Reenrollments({ corId, reqBy, reqReason});
      const savedReq = await newReq.save();

      if(savedReq){
        return NextResponse.json({ savedReq, success: true, msg:"Request sent successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedReq, success: false, msg:"Request failed." }, {status:200});
      }
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving enrData: " + error, {status: 400});
      }
    }
}