import Courses from "../../../../modals/Courses";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Categories from "../../../../modals/Categories";

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
    createdBy: string,
    eligibilityName?:string,
}

export async function GET(req:NextRequest){

    try {

      await dbConnect();
      const coList:CoType[] = await Courses.find({isActive: true})
      .populate('coCat', 'catName')
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName')
      .sort({createdAt:-1});

      // Explicitly convert each document into a plain object
    const updatedCoList = await Promise.all(
      coList.map(async (courseDoc: any) => {
        const course = courseDoc.toJSON(); // Convert Mongoose document to plain JSON
        let eligibilityName = 'None';

        if (course.coElgType === 'Course' && course.coElg !== 'None') {
          const eligibleCourse = await Courses.findById(course.coElg, 'coNick');
          eligibilityName = eligibleCourse?.coNick || 'Unknown Course';
        } else if (course.coElgType === 'Category' && course.coElg !== 'None') {
          const eligibleCategory = await Categories.findById(course.coElg, 'catName');
          eligibilityName = eligibleCategory?.catName || 'Unknown Category';
        }

        return { ...course, eligibilityName }; // Add eligibilityName to the plain object
      })
    );

      return NextResponse.json({ coList:updatedCoList, success: true }, {status:200});
  
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