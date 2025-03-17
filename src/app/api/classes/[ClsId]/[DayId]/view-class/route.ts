import { NextResponse, NextRequest } from "next/server";
import Classes from "../../../../../../../modals/Classes";
import dbConnect from "../../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ ClsId: string, DayId: string }> }){

    try {
  
      await dbConnect();
      const { ClsId, DayId } = await params;
      const clsData = await Classes.findById(ClsId);
      let clsById = clsData.clsName?.filter((a: any) => a._id.toString() === DayId)[0];

      if(!clsById){
        return NextResponse.json({ msg: "No class found." }, { status: 404 });
      }else{
        return NextResponse.json({ clsById, success: true }, {status:200});
      }
      
    } catch (error) {
      return new NextResponse("Error while fetching classData: " + error, {status:500});
    }
  }

