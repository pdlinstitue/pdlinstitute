import Courses from "../../../../modals/Courses";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type CoType = {
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

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const coList:CoType[] = await Courses.find().populate('coCat', 'catName');
      const activeCourseList = coList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ coList:activeCourseList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { coName, coNick, coShort, coType, coAuth, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, usrId }: CoType = await req.json();
  
      const newCourse = new Courses({ coName, coNick, coShort, coType, coAuth, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, usrId});
      const savedCourse = await newCourse.save();

      if(savedCourse){
        return NextResponse.json({ savedCourse, success: true, msg:"Course created successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedCourse, success: false, msg:"Course creation failed." }, {status:200});
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