import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Courses from "../../../../../../modals/Courses";
import Batches from "../../../../../../modals/Batches";

interface ICorParams {
  CorId?: string;
}

type CoType = {
  disabledBy: string;
}

export async function PATCH(req: NextRequest, { params }: { params: ICorParams }) {
  
  try 
  {
    await dbConnect();
    const { CorId } = params;
    const { disabledBy }: CoType = await req.json();

    if (!CorId) {
      return NextResponse.json({ success: false, msg: "No course found." }, { status: 400 });
    }

    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));

    const isCourseUsed = await Batches.findOne({ corId: CorId, bthEnd: { $gte: startOfDay }}).lean();

    if (isCourseUsed) {
      return NextResponse.json({ success: false, msg: "This course has an active batch. Can't be disabled." },{ status: 400 });
    } else {
      const corById = await Courses.findByIdAndUpdate( CorId, { isActive: false, disabledBy }, { runValidators: false, new: true });
      return NextResponse.json({ corById, success: true, msg: "Course disabled successfully." },{ status: 200 });
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    } else {
      return NextResponse.json({ success: false, msg: "An unexpected error occurred: " + error.message },{ status: 500 });
    }
  }
}

