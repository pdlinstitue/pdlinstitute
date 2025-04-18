import { NextRequest, NextResponse } from "next/server";
import Attendance from "../../../../../../modals/Attendance";
import dbConnect from "../../../../../../dbConnect";


export async function POST(req: NextRequest, { params }: { params: Promise<{ BthId: string; ClsId: string; }> }) {
  try {

    await dbConnect();
    const { BthId, ClsId } = await params;
    const { sdkIds, status, markedBy, absRemarks } = await req.json();

    if (!sdkIds || sdkIds.length === 0) {
      return NextResponse.json(
        { success: false, msg: "No SDK IDs provided." },
        { status: 400 }
      );
    }

    // ✅ Update multiple records at once
    const result = await Attendance.updateMany(
      { sdkId: { $in: sdkIds }, clsId: ClsId, bthId: BthId },
      { $set: { status, markedBy, absRemarks } },
      { upsert: true } // Create if not found
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return NextResponse.json(
        { success: true, msg: "Attendance updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, msg: "No records were updated. Check your input." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { success: false, msg: "Server error: " + error.message },
      { status: 500 }
    );
  }
}