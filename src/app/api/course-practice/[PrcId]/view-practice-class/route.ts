import { NextResponse, NextRequest } from "next/server";
import Practices from "../../../../../../modals/Practices";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ PrcId: string}> }){

    try {
  
      await dbConnect();
      const { PrcId } = await params;

      if(!PrcId){
        return NextResponse.json({ success: false, msg: "No practice class found." }, { status: 404 });
      } else {
        const prcById = await Practices.findById(PrcId);
        return NextResponse.json({ prcById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching corData: " + error, {status:500});
    }
  }

