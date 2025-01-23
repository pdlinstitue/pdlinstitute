import { NextResponse, NextRequest } from "next/server";
import Materials from "../../../../../../modals/Materials";
import dbConnect from "../../../../../../dbConnect";
import Courses from "../../../../../../modals/Courses";

interface IMatParams{
    MatId?: string;
}

type MatType = {
    matName:String,
    matType:String,
    matLink:String,
    matFile:String,
    corId:String,
    usrId?:String
}

export async function PUT(req: NextRequest, {params}:{params:IMatParams}) {

  try 
  {
    await dbConnect();
    
    const { matName, matFile, matType, matLink, corId, usrId }: MatType = await req.json();
    const matById = await Materials.findByIdAndUpdate(params.MatId, {matName, matFile, matType, matLink, corId, usrId}, {runValidators:true});
    const course = await Courses.findById(matById.corId);

    if(!course){
        return NextResponse.json({ success: false, msg:"No course found"}, {status:404});
    }else{
        const matWithCourseName = {
            ...matById.toObject(),
            corId: course?.coName,
        };
        return NextResponse.json({matById: matWithCourseName, success: true, msg:"Material updated successfully." }, { status: 200 });
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while editing matData: " + error, {status: 400});
    }
  }
}

