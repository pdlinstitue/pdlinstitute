import { NextResponse, NextRequest } from "next/server";
import Practices from "../../../../../../modals/Practices";
import dbConnect from "../../../../../../dbConnect";

interface IPrcParams{
    PrcId?: string;
}

export async function GET(req:NextRequest, {params}:{params:IPrcParams}){

    try {
  
      await dbConnect();
      const prcById = await Practices.findById(params.PrcId);

      if(!prcById){
        return NextResponse.json({ success: false, msg: "No practice class found." }, { status: 404 });
      }else{
        return NextResponse.json({ prcById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching corData: " + error, {status:500});
    }
  }

