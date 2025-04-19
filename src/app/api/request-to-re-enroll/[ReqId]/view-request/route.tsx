import { NextResponse, NextRequest } from "next/server";
import Reenrollments from "../../../../../../modals/Reenrollments";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ ReqId: string }>}){

    try {
  
      await dbConnect();
      const { ReqId } = await params;
      const reqById = await Reenrollments.findById(ReqId);

      if(!reqById){
        return NextResponse.json({ msg: "No request found." }, { status: 404 });
      } else{
        return NextResponse.json({ reqById, success: true }, {status:200});
      }

    } catch (error) {
      return new NextResponse("Error while fetching reqData: " + error, {status:500});
    }
  }

