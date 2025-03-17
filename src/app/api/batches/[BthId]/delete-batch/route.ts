import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";
import Classes from "../../../../../../modals/Classes";

export async function DELETE(req: Request,{ params }: { params: Promise<{ BthId: string }>}) {
  
  try {
    await dbConnect();
    const { BthId } = await params;

    if (!BthId) {
      return NextResponse.json(
        { success: false, msg: "No batch found." },
        { status: 400 }
      );
    }

    const currentDate = new Date();
    // Check if there are any future classes for the given batch
    const hasFutureClasses = await Classes.findOne({
      bthId: BthId,
      clsName: { $elemMatch: { clsDate: { $gte: currentDate } } },
    }).lean();

    if (hasFutureClasses) {
      return NextResponse.json(
        { success: false, msg: "This batch has running classes. Can't be deleted." },
        { status: 400 }
      );
    }

    // Delete the batch
    const bthById = await Batches.findByIdAndDelete(BthId);

    if (!bthById) {
      return NextResponse.json(
        { success: false, msg: "Batch not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, msg: "Batch deleted successfully." },
      { status: 200 }
    );
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