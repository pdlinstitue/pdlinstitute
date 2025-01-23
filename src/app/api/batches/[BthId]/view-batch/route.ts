import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";

interface IBthParams{
    BthId?: string;
}

export async function GET(req:NextRequest, {params}:{params:IBthParams}){

    try {
  
      await dbConnect();
      const bthById = await Batches.findById(params.BthId);

      if(!bthById){
        return NextResponse.json({ message: "No batch found." }, { status: 404 });
      }else{
        return NextResponse.json({ bthById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }

