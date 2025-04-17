import { NextRequest, NextResponse } from "next/server";
import Enrollments from "../../../../modals/Enrollments";
import dbConnect from "../../../../dbConnect";


export async function GET(req: NextRequest){

    try {
  
      await dbConnect();
      const sdkId = req.nextUrl.searchParams.get("sdkId");

      if (!sdkId) {
        return new NextResponse(JSON.stringify({sucess:false, msg: "No Sadhak Found" }), { status: 404 });
      }
  
      // Populate 'bthId' with all fields from BatchType
      const enrListBySdkId = await Enrollments.find({ sdkId:sdkId, isApproved:"Approved"})
      .populate("corId","coNick")
      .populate("bthId", "bthName bthShift bthStart bthEnd bthLang bthMode")
      .sort({createdAt: -1});

      if (enrListBySdkId.length > 0){
          return NextResponse.json({sucess:true, enrListBySdkId}, { status: 200 }); 
      } else {
          return NextResponse.json({sucess:false, msg:"No batches found"}, { status: 404 }); 
      }            
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while fetching myBatchData: " + error, {status: 400});
      }
    }
  }