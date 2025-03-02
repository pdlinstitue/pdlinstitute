import Prospects from "../../../../modals/Prospects";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type ProsType = {
    _id:string,
    prosMonth: string, 
    prosShift:string,
    corId:string, 
    usrId:string
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const prosList:ProsType[] = await Prospects.find()
      .populate('corId', 'coName')
      .populate('usrId', 'sdkName');

      if(prosList && prosList.length > 0){
        const activeProsList = prosList.filter((item:any)=> item.isActive === true);
        return NextResponse.json({ prosList:activeProsList, success: true }, {status:200});
      } else {
        return NextResponse.json({ msg:"No prospect list found", success: false }, {status:404});
      }
  
    } catch (error) {
      return new NextResponse("Error while fetching courseData: " + error, {status:500});
    }
  }
  
