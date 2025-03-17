import { NextResponse, NextRequest } from "next/server";
import Courses from "../../../../../../modals/Courses";
import dbConnect from "../../../../../../dbConnect";


type CoType = {
    _id?: string,
    coName: string, 
    coNick:string,
    coShort:string, 
    prodType:string, 
    coElgType: string,
    coCat: string,
    coElg: string,
    coImg: string,
    coType: string,
    coWhatGrp: string,
    coTeleGrp: string,
    coDesc:string, 
    coDon:number, 
    durDays:number, 
    durHrs:number, 
    updatedBy: string
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ CorId: string}> }) {

  try 
  {
    await dbConnect();
    const { CorId } = await params;
    const corById = await Courses.findById(CorId);

    if (!corById) {
      return NextResponse.json({ success: false, msg: "No course found." }, { status: 404 });
    } else {  
      const { coName, coNick, coShort, coType, coElgType, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, updatedBy }: CoType = await req.json();
      const corById = await Courses.findByIdAndUpdate(CorId, {coName, coNick, coShort, coType, coElgType, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, updatedBy }, {runValidators:true});
      return NextResponse.json({ success: true, corById, msg: "Course updated successfully." }, { status: 200 });
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while updating course: " + error, {status: 400});
    }
  }
}

