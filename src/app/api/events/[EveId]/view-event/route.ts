import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Events from "../../../../../../modals/Events";

interface IEveParams{
    EveId?: string;
}

export async function GET(req:NextRequest, {params}:{params:IEveParams}){

    try {
  
      await dbConnect();
      const eveById = await Events.findById(params.EveId);
      return NextResponse.json({ eveById, success: true }, {status:200});

    } catch (error) {
      return new NextResponse("Error while fetching eventData: " + error, {status:500});
    }
  }

