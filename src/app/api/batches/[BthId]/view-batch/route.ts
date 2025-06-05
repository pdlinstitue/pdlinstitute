import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";
import { verifyApiToken } from "@/app/utils/auth";


export async function GET(req: Request,{ params }: { params: Promise<{ BthId: string }>}){

    try {
  
      await verifyApiToken(); 
      await dbConnect();
      const { BthId } = await params;
      const bthById = await Batches.findById(BthId);

      if(!bthById){
        return NextResponse.json({ msg: "No batch found." }, { status: 404 });
      }else{
        return NextResponse.json({ bthById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }

