import { NextResponse, NextRequest } from "next/server";
import Roles from "../../../../../../modals/Roles";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ RolId: string }>}){

    try {
  
      await dbConnect();
      const { RolId } = await params;
      const rolById = await Roles.findById(RolId);

      if(!rolById){
        return NextResponse.json({ message: "No role found." }, { status: 404 });
      }else{
        return NextResponse.json({ rolById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching rolData: " + error, {status:500});
    }
  }

