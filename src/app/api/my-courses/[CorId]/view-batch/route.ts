import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";
import mongoose from "mongoose";
import Enrollments from "../../../../../../modals/Enrollments";

type BatchType = {
  bthName:string, 
  bthTime:string, 
  bthStart:Date, 
  bthEnd:Date, 
  corId:mongoose.Schema.Types.ObjectId, 
  bthVtr:string, 
  bthWhatGrp:string, 
  bthTeleGrp:string, 
  bthLang:string, 
  bthMode:string, 
  bthLink:string, 
  bthLoc:string, 
  bthBank:string, 
  bthQr:string,
}

export async function GET(req: NextRequest,{ params }: { params: Promise<{ CorId: string}> }){

    try {
  
      const sdkIdParam = req.nextUrl.searchParams.get("sdkId");
const exclParam = req.nextUrl.searchParams.get("excl");

const sdkId: string = sdkIdParam ?? ""; // Or handle null appropriately
const excl: boolean = exclParam === "true"; // Converts "true" to true


      await dbConnect();
      const { CorId } = await params;

      let bthIds: any[] = [];
      if (excl && sdkId) {
        const enr = await Enrollments.find({
          corId: CorId,
          sdkId: new mongoose.Types.ObjectId(sdkId),
        });
      
        bthIds = enr
          .filter((a: any) => a.isApproved === "Pending" || a.isApproved === "Approved")
          .map((a: any) => a.bthId);
      }      

      const bthList: BatchType[] = await Batches.find({ _id: { $nin: bthIds } });
      const bthListByCourseId = bthList.filter((bth:any) =>  bth.corId.toString() === CorId?.toString());

      if(bthListByCourseId.length === 0){
        return NextResponse.json({success:false, msg:"No Batches found"}, {status:404});
      } else{
        return NextResponse.json({ bthListByCourseId, success: true }, {status:200});
      }

    } catch (error) {
      return new NextResponse("Error while fetching bthByCourseId: " + error, {status:500});
    }
  }

