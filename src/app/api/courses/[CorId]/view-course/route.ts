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
        let eligibilityName = "None";
                if (corById.coElgType === "Course" && corById.coElg !== "None") {
                    const eligibleCourse = await Courses.findById(corById.coElg, "coNick");
                    eligibilityName = eligibleCourse ? eligibleCourse.coNick : "Unknown Course";
                } else if (corById.coElgType === "Category" && corById.coElg !== "None") {
                    const eligibleCategory = await Categories.findById(corById.coElg, "catName");
                    eligibilityName = eligibleCategory ? eligibleCategory.catName : "Unknown Category";
                } else {
                    eligibilityName = corById.coElg;
                }
        return NextResponse.json({ corById, catName: catNameByCourseId, corEligibility:eligibilityName, success: true }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, msg: "No category found." }, { status: 404 });
      }
    }
  } catch (error) {
    return new NextResponse("Error while fetching corData: " + error, { status: 500 });
  }
}


