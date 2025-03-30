import { NextRequest, NextResponse } from "next/server";
import Classes from "../../../../../../modals/Classes";
import dbConnect from "../../../../../../dbConnect";

export async function GET(req:NextRequest,{ params }: { params: { BthId: string } }){

    try {
  
      await dbConnect();
      const { BthId } = params;

      const clsList = await Classes.find({bthId: BthId, clsName: { $elemMatch: { isActive: true }}})
      .populate("bthId", "bthName")
      .populate("corId", "coNick")
      .sort({createdAt: -1}); 

      if(clsList.length > 0){
        return NextResponse.json({ clsList, success: true }, {status:200});
      } else {
        return NextResponse.json({ success: false, msg:"No classes found." }, {status:404});
      }
    } catch (error) {
      return new NextResponse("Error while fetching classData: " + error, {status:500});
    }
  }