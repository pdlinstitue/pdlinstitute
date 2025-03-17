import { NextResponse, NextRequest } from "next/server";
import Coupons from "../../../../../../modals/Coupons";
import dbConnect from "../../../../../../dbConnect";


type CpnType = {
  isActive: boolean,
  disabledBy: string
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ CpnId: string}> }) {

    try 
    {
      await dbConnect();
      const { CpnId } = await params;
      const { disabledBy }: CpnType = await req.json();

      if (!CpnId) { 
        return new NextResponse("No Coupon Found", { status: 404 }); 
      } else {
        const cpnById = await Coupons.findByIdAndUpdate(CpnId, {isActive:false, disabledBy}, {runValidators:false}); 
        return NextResponse.json({ cpnById, success: true, msg: "Coupon disabled successfully." }, { status: 200 });
      }
      
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving data: " + error, {status: 400});
      }
    }
  }