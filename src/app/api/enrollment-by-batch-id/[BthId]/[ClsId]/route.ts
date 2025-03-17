import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Enrollments from "../../../../../../modals/Enrollments";
import Attendance from "../../../../../../modals/Attendance";
import mongoose from "mongoose";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ BthId: string, ClsId:string}> }) {

  try {
    await dbConnect();
    const {BthId, ClsId} = await params;
    // Convert params to ObjectId if necessary
    const batchId = new mongoose.Types.ObjectId(BthId);
    const classId = new mongoose.Types.ObjectId(ClsId);

    // Fetch enrollments
    const enrByBatchId = await Enrollments.find({ bthId: batchId }).populate("createdBy", "sdkFstName sdkPhone");

    if (!enrByBatchId || enrByBatchId.length === 0) {
      return NextResponse.json({ msg: "No enrollment found." }, { status: 404 });
    }

    // Fetch attendance details for each enrollment
    const enrichedEnrollments = await Promise.all(
      enrByBatchId.map(async (enrollment) => {
        const attendanceRecord = await Attendance.findOne({
          bthId: batchId,
          clsId: classId,
          sdkId: enrollment.createdBy._id, // Ensure this matches the field in Attendance
        });

        return {
          ...enrollment.toObject(),
          attendanceStatus: attendanceRecord ? attendanceRecord.status : "Pending",
          attendanceRemark: attendanceRecord ? attendanceRecord.absRemarks : "",
        };
      })
    );

    return NextResponse.json({ enrollments: enrichedEnrollments, success: true }, { status: 200 });
  } catch (error) {
    return new NextResponse("Error while fetching enrollment data: " + error, { status: 500 });
  }
}