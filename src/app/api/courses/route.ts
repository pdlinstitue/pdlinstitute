import Courses from "../../../../modals/Courses";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type CoType = {
    coName: string, 
    coNick:string,
    coShort:string, 
    prodType:string, 
    coCat: string,
    coElgType: string,
    coElg: string,
    coImg: string,
    coType: string,
    coWhatGrp: string,
    coTeleGrp: string,
    coDesc:string, 
    coDon:number, 
    durDays:number, 
    durHrs:number, 
    createdBy: string
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const coList:CoType[] = await Courses.find()
      .populate('coCat', 'catName')
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName');
      const activeCourseList = coList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ coList:activeCourseList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching coData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { coName, coNick, coShort, coType, coElgType, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, createdBy }: CoType = await req.json();
  
      const newCourse = new Courses({ coName, coNick, coShort, coType, coElgType, coDon, coDesc, prodType, coCat, coElg, coWhatGrp, coTeleGrp, durDays, durHrs, coImg, createdBy});
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