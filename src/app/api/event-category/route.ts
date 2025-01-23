import Eventcat from "../../../../modals/Eventcat";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type EveCatType = {
    _id?: string;
    eveCatName:string;
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      let eveCatList:EveCatType[] = await Eventcat.find();
      eveCatList = eveCatList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ eveCatList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching evecatData: " + error, {status:500});
    }
  }
  
  export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { eveCatName }: EveCatType = await req.json();
  
      const newEventCategory = new Eventcat({ eveCatName});
      const savedEventCategory = await newEventCategory.save();
      return NextResponse.json({ savedEventCategory, success: true, msg:"Category for event created." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving eventCatData: " + error, {status: 400});
      }
    }
  }