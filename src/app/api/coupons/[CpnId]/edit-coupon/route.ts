import { NextResponse, NextRequest } from "next/server";
import Coupons from "../../../../../../modals/Coupons";
import dbConnect from "../../../../../../dbConnect";

interface ICpnParams{
    CpnId?: string;
}

type CpnType = {
    _id:String,
    cpnName: String,
    cpnUse: Number,
    cpnVal:Number,
    cpnDisType: String,
    cpnDisc:Number,
    cpnCourse: String,
    cpnFor: String,
    cpnSdk: [String],
    usrId: String 
}

export async function PUT(req: NextRequest, {params}:{params:ICpnParams}) {

  try 
  {
    await dbConnect();
    
    const { cpnName, cpnUse, cpnVal, cpnDisType, cpnDisc, cpnCourse, cpnFor, cpnSdk, usrId  }: CpnType = await req.json();
    const cpnById = await Coupons.findByIdAndUpdate(params.CpnId, {cpnName, cpnUse, cpnVal, cpnDisType, cpnDisc, cpnCourse, cpnFor, cpnSdk, usrId}, {runValidators:true});

    if(!cpnById){
      return NextResponse.json({ success:false, msg: "No coupon found." }, { status: 404 });
    }else{
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

