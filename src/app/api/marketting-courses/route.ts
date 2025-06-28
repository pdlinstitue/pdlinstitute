import Courses from "../../../../modals/Courses";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Categories from "../../../../modals/Categories";

type CoType = {
    coName: string, 
    coNick:string,
    coShort:string, 
    prodType:string, 
    coElgType: string,
    coCat: string,
    coElg: string,    
    coImg: string,
    coType: string,
    coDesc:string, 
    coDon:number, 
    durDays:number, 
    durHrs:number, 
    eligibilityName?:string,
}

export async function GET(req:NextRequest){

    try {
      await dbConnect();
      const coList:CoType[] = await Courses.find({isActive: true})
      .populate('coCat', 'catName')
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
  
