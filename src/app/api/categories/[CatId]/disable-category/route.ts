import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import dbConnect from "../../../../../../dbConnect";
import Courses from "../../../../../../modals/Courses";

type CatType = {
  isActive:boolean;
  disabledBy:string;
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ CatId: string }>}) {

    try 
    {
      await dbConnect();
      const { CatId } = await params;
      const { disabledBy }: CatType = await req.json();
      const isCategoryUsed = await Courses.findOne({ coCat: CatId });

      if (isCategoryUsed) {
          return NextResponse.json({success:false, msg: "Category is being used. Can't be disabled." }, { status: 400 });
      }else{
        const catById = await Categories.findByIdAndUpdate(CatId, {isActive:false, disabledBy}, {runValidators:false});
        return NextResponse.json({ catById, success: true, msg:"Category disabled successfully." }, {status:200});   
      }
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while disabling category: " + error, {status: 500});
      }
    }
  }