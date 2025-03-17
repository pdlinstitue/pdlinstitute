import Coupons from "../../../../../../modals/Coupons";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ CpnId: string}> }){

    try {
  
      await dbConnect();
      const { CpnId } = await params;
      const cpnById = await Coupons.findById(CpnId);

      if(!cpnById){
        return NextResponse.json({ success: false, msg: "No coupon found." }, { status: 404 });
      }else{
        return NextResponse.json({ cpnById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching cpnData: " + error, {status:500});
    }
  }
