import Practices from "../../../../modals/Practices";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type PrcType = {
  prcName: String,
  prcLang:String,
  prcImg:String,
  prcDays: [String],
  prcStartsAt: String,
  prcEndsAt: String,
  prcLink: String,
  prcWhatLink: String,
  createdBy: String 
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const prcList:PrcType[] = await Practices.find({isActive: true})
      .populate("prcName", "coName coNick")
      .sort({createdAt:-1});
      
      if(prcList.length > 0 ){
        return NextResponse.json({ prcList, success: true }, {status:200});
      } else {
        return NextResponse.json({ success: false, msg:"No practice class found" }, {status:404});
      } 
    } catch (error) {
      return new NextResponse("Error while fetching practiceData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { prcName, prcLang, prcDays, prcStartsAt, prcEndsAt, prcLink, prcWhatLink,  prcImg, createdBy }: PrcType = await req.json();
  
      const newPractices = new Practices({ prcName, prcLang, prcDays, prcStartsAt, prcEndsAt, prcLink, prcWhatLink, prcImg, createdBy});
      const savedPractice = await newPractices.save();

      if(savedPractice){
        return NextResponse.json({ savedPractice, success: true, msg:"Practice class created successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedPractice, success: false, msg:"Practice class creation failed." }, {status:200});
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