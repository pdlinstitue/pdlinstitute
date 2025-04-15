import { NextResponse, NextRequest } from "next/server";
import Modules from "../../../../../../modals/Modules";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ AtnId: string }>}){

    try {
  
      await dbConnect();
      const { AtnId } = await params;
      const atnById = await Modules.findById(AtnId);

      if(!atnById){
        return NextResponse.json({ msg: "No action found." }, { status: 404 });
      }else{
        return NextResponse.json({ atnById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching atnData: " + error, {status:500});
    }
  }

