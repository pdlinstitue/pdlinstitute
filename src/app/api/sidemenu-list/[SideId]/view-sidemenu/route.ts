import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Sidemenues from "../../../../../../modals/Sidemenues";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ SideId: string }>}){

    try {
  
      await dbConnect();
      const { SideId } = await params;
      const sideById = await Sidemenues.findById(SideId);

      if(!sideById){
        return NextResponse.json({ msg: "No sidemenu found." }, { status: 404 });
      }else{
        return NextResponse.json({ sideById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching sidemenuData: " + error, {status:500});
    }
  }

