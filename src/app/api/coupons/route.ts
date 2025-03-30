import Coupons from "../../../../modals/Coupons";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type CpnType = {
    cpnName: String,
    cpnUse: Number,
    cpnVal:Number,
    cpnDisType: String,
    cpnDisc:Number,
    cpnCourse: String,
    cpnFor: String,
    cpnSdk: [String],
    createdBy: String 
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const cpnList:CpnType[] = await Coupons.find({isActive: true})
      .populate('cpnCourse', 'coNick')
      .sort({createdAt:-1});

      return NextResponse.json({ cpnList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching cpnData: " + error, {status:500});
    }
  }
  
  export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { cpnName, cpnUse, cpnVal, cpnDisType, cpnDisc, cpnCourse, cpnFor, cpnSdk, createdBy  }: CpnType = await req.json();
  
      const newCoupon = new Coupons({ cpnName, cpnUse, cpnVal, cpnDisType, cpnDisc, cpnCourse, cpnFor, cpnSdk, createdBy});
      const savedCoupon = await newCoupon.save();
  
      return NextResponse.json({ savedCoupon, success: true, msg:"Coupon generated successfully." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving data: " + error, {status: 400});
      }
    }
  }