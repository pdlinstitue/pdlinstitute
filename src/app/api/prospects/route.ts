import Prospects from "../../../../modals/Prospects";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type ProsType = {
    _id:string,
    prosMonth: string, 
    prosShift:string,
    prosWeek:number,
    prosOptMonth: string, 
    prosOptShift:string,
    prosOptWeek:number,
    sdkId:string,
    corId:string, 
    createdBy:string
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const prosList:ProsType[] = await Prospects.find({isActive:true})
      .populate('corId', 'coNick')
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName')
      .populate('sdkId', 'sdkRegNo sdkPhone')
      .sort({createdAt:-1});

      if(prosList && prosList.length > 0){
        return NextResponse.json({ prosList, success: true }, {status:200});
      } else {
        return NextResponse.json({ msg:"No prospect list found", success: false }, {status:404});
      }
  
    } catch (error) {
      return new NextResponse("Error while fetching prospectData: " + error, {status:500});
    }
  }
  
