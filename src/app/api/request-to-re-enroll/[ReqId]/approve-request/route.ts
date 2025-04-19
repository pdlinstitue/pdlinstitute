import { NextResponse, NextRequest } from "next/server";
import Reenrollments from "../../../../../../modals/Reenrollments";
import dbConnect from "../../../../../../dbConnect";

type ReenrollmentsType = {
    reqStatus: string;
    updatedBy: string;
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ ReqId: string }>}) {

  try 
  {
    await dbConnect();
    const { ReqId } = await params;
    const { reqStatus, updatedBy }: ReenrollmentsType = await req.json();

    if(!ReqId){
      return NextResponse.json({ msg: "No request id found." }, { status: 404 });
    }else{
      const reqById = await Reenrollments.findByIdAndUpdate(ReqId, {reqStatus, updatedBy}, {runValidators:true});
      if(reqById){
          return NextResponse.json({ reqById, success: true, msg:"Request updated successfully." }, {status:200});
      } else {
          return NextResponse.json({sucess:false, msg: "Request updation failed." }, { status: 404 });
      }
    }
    
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving catData: " + error, {status: 500});
    }
  }
}

