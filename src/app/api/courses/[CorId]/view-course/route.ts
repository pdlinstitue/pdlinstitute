import { NextResponse, NextRequest } from "next/server";
import Courses from "../../../../../../modals/Courses";
import dbConnect from "../../../../../../dbConnect";

interface ICorParams{
    CorId?: string;
}

export async function GET(req:NextRequest, {params}:{params:ICorParams}){

    try {
  
      await dbConnect();
      const corById = await Courses.findById(params.CorId);

      if(!corById){
        return NextResponse.json({ success: false, msg: "No course found." }, { status: 404 });
      }else{
        return NextResponse.json({ corById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching corData: " + error, {status:500});
    }
  }

