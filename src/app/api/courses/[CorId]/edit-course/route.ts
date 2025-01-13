import { NextResponse, NextRequest } from "next/server";
import Courses from "../../../../../../modals/Courses";
import dbConnect from "../../../../../../dbConnect";

interface ICorParams{
    CorId?: string;
}

type CoType = {
    _id?: string,
    coName: string, 
    coNick:string,
    coShort:string, 
    prodType:string, 
    coAuth: string,
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
    usrId: string
}

export async function PUT(req: NextRequest, {params}:{params:ICorParams}) {

  try 
  {
    await dbConnect();
    
    const { coName, coNick, coShort, coType, coAuth, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, usrId }: CoType = await req.json();
    const corById = await Courses.findByIdAndUpdate(params.CorId, {coName, coNick, coShort, coType, coAuth, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, usrId}, {runValidators:true});

    if(!corById){
      return NextResponse.json({ success:false, msg: "No course found." }, { status: 404 });
    }else{
        return NextResponse.json({ corById, success: true, msg:"Course updated successfully." }, {status:200});
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

