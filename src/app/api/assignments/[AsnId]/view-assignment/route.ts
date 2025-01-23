import { NextResponse, NextRequest } from "next/server";
import Assignments from "../../../../../../modals/Assignments";
import dbConnect from "../../../../../../dbConnect";

interface IAsnParams{
    AsnId?: string;
}

export async function GET(req:NextRequest, {params}:{params:IAsnParams}){

    try {
  
      await dbConnect();
      const asnById = await Assignments.findById(params.AsnId);

      if(!asnById){
        return NextResponse.json({ message: "No assignment found." }, { status: 404 });
      }else{
        return NextResponse.json({ asnById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching asnData: " + error, {status:500});
    }
  }

