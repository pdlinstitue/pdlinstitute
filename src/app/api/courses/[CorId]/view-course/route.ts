import { NextResponse, NextRequest } from "next/server";
import Courses from "../../../../../../modals/Courses";
import dbConnect from "../../../../../../dbConnect";
import Categories from "../../../../../../modals/Categories";
 

export async function GET(req: NextRequest,{ params }: { params: Promise<{ CorId: string}> }) {

  try 
  {
    await dbConnect();
    const { CorId } = await params;
    const corById = await Courses.findById(CorId);

    if (!corById) {
      return NextResponse.json({ success: false, msg: "No course found." }, { status: 404 });
    } else {
      
      const catId = corById.coCat;
      const catByCourseId = await Categories.findById(catId);
      const catNameByCourseId = catByCourseId?.catName;

      if (catNameByCourseId) {
        return NextResponse.json({ corById, catName: catNameByCourseId, success: true }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: "No category found." }, { status: 404 });
      }
    }
  } catch (error) {
    return new NextResponse("Error while fetching corData: " + error, { status: 500 });
  }
}


