import { NextRequest, NextResponse } from "next/server";
import Enrollments from "../../../../modals/Enrollments";
import dbConnect from "../../../../dbConnect";
import Practices from "../../../../modals/Practices";


export async function GET(req: NextRequest){

    try {
  
      await dbConnect();
      const sdkId = req.nextUrl.searchParams.get("sdkId");

      if (!sdkId) {
        return new NextResponse(JSON.stringify({sucess:false, msg: "No Sadhak Found" }), { status: 404 });
      }

      const enrListBySdkId = await Enrollments.find({ sdkId:sdkId, isApproved:"Approved" , isCompleted:"Complete" });
      const corIds = enrListBySdkId.map((enr:any) => enr.corId);
      const prcList = await Practices.find({ prcName: { $in: corIds }, isActive: true })
      .populate("prcName", "coNick coName")
      .sort({createdAt:-1});

      if (Array.isArray(prcList)  && prcList.length > 0){
          return NextResponse.json({sucess:true, prcList:prcList}, { status: 200 }); 
      } else {
          return NextResponse.json({sucess:false, msg:"No practice class found"}, { status: 404 }); 
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