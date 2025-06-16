import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Sidemenues from "../../../../../../modals/Sidemenues";
import { verifyApiToken } from "@/app/utils/verifyApiToken";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ SideId: string }>}){

    try {
  
      await verifyApiToken();
      await dbConnect();
      const { SideId } = await params;
      const sideMenuById = await Sidemenues.findById(SideId);

      if(!sideMenuById){
        return NextResponse.json({ msg: "No sidemenu found." }, { status: 404 });
      }else{
        return NextResponse.json({ sideMenuById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching sidemenuData: " + error, {status:500});
    }
  }

