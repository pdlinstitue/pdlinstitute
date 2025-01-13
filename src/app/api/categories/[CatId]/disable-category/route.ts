import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import dbConnect from "../../../../../../dbConnect";
import Courses from "../../../../../../modals/Courses";

interface ICatParams{
    CatId?: string;
}

export async function PATCH(req: NextRequest, {params}:{params:ICatParams}) {

    try 
    {
      await dbConnect();
      const isCategoryUsed = await Courses.findOne({ coCat: params.CatId });

      if (isCategoryUsed) {
          return NextResponse.json({success:false, msg: "Category is being used. Can't be disabled." }, { status: 400 });
      }else{

        const catById = await Categories.findByIdAndUpdate(params.CatId, {isActive:false}, {runValidators:false});
        return NextResponse.json({ catById, success: true, msg:"Category disabled successfully." }, {status:200});   
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