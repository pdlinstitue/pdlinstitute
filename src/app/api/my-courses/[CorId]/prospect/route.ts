import Enrollments from "../../../../../../modals/Enrollments";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Prospects from "../../../../../../modals/Prospects";


type ProsType = {
  prosMonth:string,
  prosShift:string,
  prosWeek:number,
  prosOptMonth:string,
  prosOptShift:string,
  prosOptWeek:number,
  corId:string,
  createdBy:string
}

export async function GET(req:NextRequest){

  try {

    await dbConnect();
    const prosList:ProsType[] = await Enrollments.find().populate('corId', 'coName');

    if (prosList && prosList.length > 0){
      const activeProsList = prosList.filter((item:any)=> item.isActive === true);
      if(activeProsList && activeProsList.length > 0){
          return NextResponse.json({ prosList:activeProsList, success: true }, {status:200});
      }else {
          return NextResponse.json({ message: "No active prospects found", success: false }, { status: 404 });
      }
    }else {
      return NextResponse.json({ message: "No prospects found", success: false }, { status: 404 });
    }      

  } catch (error) {
    return new NextResponse("Error while fetching enrData: " + error, {status:500});
  }
}
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { prosMonth, prosShift, prosWeek, prosOptMonth, prosOptShift, prosOptWeek, corId, createdBy }: ProsType = await req.json();
  
      const newPros = new Prospects({ prosMonth, prosShift, prosWeek, prosOptMonth, prosOptShift, prosOptWeek, corId, createdBy});
      const savedPros = await newPros.save();

      if(savedPros){
        return NextResponse.json({ savedPros, success: true, msg:"Request sent successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedPros, success: false, msg:"Request failed." }, {status:200});
      }
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving enrData: " + error, {status: 400});
      }
    }
}