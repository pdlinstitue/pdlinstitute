import { NextResponse, NextRequest } from "next/server";
import Coupons from "../../../../../../modals/Coupons";
import dbConnect from "../../../../../../dbConnect";


interface ICpnParams{
    CpnId: string;
}

export async function PATCH(req: NextRequest, {params}:{params:ICpnParams}) {

    try 
    {
      await dbConnect();
      const cpnById = await Coupons.findByIdAndUpdate(params.CpnId, {isActive:false}, {runValidators:false});

      if (!cpnById) { 
        return new NextResponse("Coupon not found", { status: 404 }); 
      } else {
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