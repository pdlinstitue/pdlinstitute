import { NextResponse, NextRequest } from "next/server";
import Coupons from "../../../../../../modals/Coupons";
import dbConnect from "../../../../../../dbConnect";

type CpnType = {
  _id: string,
  cpnName: string,
  cpnUse: number,
  cpnVal: number,
  cpnDisType: string,
  cpnDisc: number,
  cpnCourse: string,
  cpnFor: string,
  cpnSdk: string[],
  updatedBy: string 
}


export async function PUT(req: NextRequest,{ params }: { params: Promise<{ CpnId: string}> }) {

  try 
  {
    await dbConnect();
    const { CpnId } = await params;

    if(!CpnId){
      return NextResponse.json({ success:false, msg: "No coupon found." }, { status: 404 });
    }else{
      const { cpnName, cpnUse, cpnVal, cpnDisType, cpnDisc, cpnCourse, cpnFor, cpnSdk, updatedBy  }: CpnType = await req.json();
      const cpnById = await Coupons.findByIdAndUpdate(CpnId, {cpnName, cpnUse, cpnVal, cpnDisType, cpnDisc, cpnCourse, cpnFor, cpnSdk, updatedBy}, {runValidators:true});
      return NextResponse.json({ cpnById, success: true, msg:"Coupon updated successfully." }, {status:200});
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while updating coupon: " + error, {status: 400});
    }
  }
}

