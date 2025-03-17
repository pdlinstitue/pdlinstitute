import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Courses from "../../../../../../modals/Courses";
import Batches from "../../../../../../modals/Batches";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ CorId: string}> }) {

 try 
  {
    await dbConnect();
    const { CorId } = await params;

    if (!CorId) {
      return NextResponse.json({ success: false, msg: "No Course Found." }, { status: 400 });
    }

    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); //excluding time

    // Check if there is any active batch for the given course
    const isCourseUsed = await Batches.findOne({ corId: CorId, bthEnd: { $gte: startOfDay }}).lean();

    if (isCourseUsed) {
      return NextResponse.json(
        { success: false, msg: "This course has an active batch. Can't be deleted." },
        { status: 400 }
      );
    } else {
      //Delete the course
      const delCourse = await Courses.findByIdAndDelete(CorId);
      return NextResponse.json({delCourse, success:true, msg: "Course deleted successfully." }, { status: 200 });
    }
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    }
    // Handle unexpected errors
    return NextResponse.json(
      { success: false, msg: "An unexpected error occurred: " + error.message },
      { status: 500 }
    );
  }
}

