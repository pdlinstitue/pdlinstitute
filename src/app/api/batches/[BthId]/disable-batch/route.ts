import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";
import Classes from "../../../../../../modals/Classes";
import Enrollments from "../../../../../../modals/Enrollments";

type BatchType = {
  isActive: boolean;
  disabledBy: string;
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ BthId: string }> }) {
  
  try {
    await dbConnect();
    const { BthId } = await params;
    const { disabledBy }: BatchType = await req.json();

    if (!BthId) {
      return NextResponse.json({ success: false, msg: "No batch found." }, { status: 400 });
    }

    const currentDate = new Date();
    
    // Check if there are any future classes for the given batch
    const hasFutureClasses = await Classes.findOne({
      bthId: BthId,
      clsName: { $elemMatch: { clsDate: { $gte: currentDate } } },
    }).lean();

    if (hasFutureClasses) {
      return NextResponse.json({ success: false, msg: "This batch has running classes. Can't be disabled." }, { status: 400 });
    }
    
    // Check if there are any enrollments for this batch
    const hasEnrollments = await Enrollments.findOne({ bthId: BthId }).lean();
    
    if (hasEnrollments) {
      return NextResponse.json({ success: false, msg: "This batch has enrollments. Can't be disabled." }, { status: 400 });
    }
    
    // Disable batch
    const bthById = await Batches.findByIdAndUpdate(
      BthId,
      { isActive: false, disabledBy },
      { runValidators: false, new: true }
    );

    return NextResponse.json({ bthById, success: true, msg: "Batch disabled successfully." }, { status: 200 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, msg: "An unexpected error occurred: " + error.message },
      { status: 500 }
    );
  }
}
