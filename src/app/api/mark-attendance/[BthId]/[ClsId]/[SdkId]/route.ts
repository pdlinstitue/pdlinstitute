import { NextRequest, NextResponse } from "next/server";
import Attendance from "../../../../../../../modals/Attendance";
import dbConnect from "../../../../../../../dbConnect";

type AttdType = {
  status: string;
  absRemarks: string;
  markedBy: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { BthId: string; ClsId: string; SdkId: string } }
) {
  try {
    await dbConnect();
    const { BthId, ClsId, SdkId } = params;

    const attendance = await Attendance.findOne({
      bthId: BthId,
      clsId: ClsId,
      sdkId: SdkId,
    });

    if (attendance) {
      return NextResponse.json(
        { success: true, attendance, msg: "Attendance record found." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, msg: "No attendance record found." },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { success: false, msg: "Error fetching attendance data." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { BthId: string; ClsId: string; SdkId: string } }
) {
  try {
    await dbConnect();
    const { BthId, ClsId, SdkId } = params;
    const { status, absRemarks, markedBy }: AttdType = await req.json();

    const existingAttd = await Attendance.findOne({
      bthId: BthId,
      clsId: ClsId,
      sdkId: SdkId,
    });

    if (existingAttd) {
      existingAttd.status = status;
      existingAttd.absRemarks = absRemarks;
      existingAttd.markedBy = markedBy;
      await existingAttd.save();
      return NextResponse.json(
        { success: true, attendance: existingAttd, msg: "Attendance updated successfully." },
        { status: 200 }
      );
    } else {
      const newAttd = new Attendance({
        bthId: BthId,
        clsId: ClsId,
        sdkId: SdkId,
        status,
        absRemarks,
        markedBy,
      });
      await newAttd.save();
      return NextResponse.json(
        { success: true, attendance: newAttd, msg: "Attendance marked successfully." },
        { status: 201 }
      );
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, msg: messages },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, msg: "Error while processing request: " + error.message },
        { status: 500 }
      );
    }
  }
}