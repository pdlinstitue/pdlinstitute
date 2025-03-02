import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../dbConnect";
import Enrollments from "../../../../../modals/Enrollments";

interface IBthParams{
    BthId?: string;
}

export async function GET(req:NextRequest, {params}:{params:IBthParams}){

    try {
  
      await dbConnect();
      const EnrList = await Enrollments.find().populate('bthId','_id');
      const enrByBatchId = EnrList.filter((item:any) => item.bthId._id.toString() === params.BthId)

      if(!enrByBatchId){
        return NextResponse.json({ message: "No enrollment found." }, { status: 404 });
      }else{
        return NextResponse.json({ enrByBatchId, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }