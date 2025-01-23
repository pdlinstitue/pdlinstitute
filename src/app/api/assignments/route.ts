import { NextRequest, NextResponse } from "next/server";
import Assignments from "../../../../modals/Assignments";
import dbConnect from "../../../../dbConnect";

type AssignmentType = {
  asnName: string, 
  asnType: string, 
  asnLink: string, 
  asnFile: string,
  asnOrder: string, 
  corId: string, 
  usrId?: string
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const asnList:AssignmentType[] = await Assignments.find().populate('corId', 'coName coNick');
      const assignmentList = asnList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ asnList:assignmentList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching asnData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) { 
try 
  {
    await dbConnect();
    const {asnName, asnType, asnOrder, corId, asnLink, asnFile, usrId}: AssignmentType = await req.json();

    const newAssignment = new Assignments({ asnName, asnType, asnOrder, corId, asnLink, asnFile, usrId});
    const savedAssignment = await newAssignment.save();

    if(savedAssignment){
      return NextResponse.json({ savedAssignment, success: true, msg:"Assignment created successfully." }, {status:200});
    }else{
      return NextResponse.json({ savedAssignment, success: false, msg:"Assignment creation failed." }, {status:200});
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving assignmentData: " + error, {status: 400});
    }
  }
}