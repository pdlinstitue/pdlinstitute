import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Menuaccess from "../../../../../../modals/Menuaccess";
import { verifyApiToken } from "@/app/utils/auth";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ MacId: string }>}){

    try {
  
      await verifyApiToken(); 
      await dbConnect();
      const { MacId } = await params;
      const menuAccById = await Menuaccess.findById(MacId);

      if(!menuAccById){
        return NextResponse.json({ msg: "No sidemenu found." }, { status: 404 });
      }else{
        return NextResponse.json({ menuAccById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching menuAccData: " + error, {status:500});
    }
  }

