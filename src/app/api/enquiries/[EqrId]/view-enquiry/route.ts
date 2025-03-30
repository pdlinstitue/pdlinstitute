import { NextResponse, NextRequest } from "next/server";
import Enquiries from "../../../../../../modals/Enquiries";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ EqrId: string }>}){

    try {
  
      await dbConnect();
      
      const { EqrId } = await params;
      const eqrById = await Enquiries.findById(EqrId);

      if(!eqrById){
        return NextResponse.json({ msg: "No enquiry found." }, { status: 404 });
      }else{
        return NextResponse.json({ eqrById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching eqrData: " + error, {status:500});
    }
  }

