import { NextRequest, NextResponse } from "next/server";
import Classes from "../../../../../../modals/Classes";
import dbConnect from "../../../../../../dbConnect";
import Attendance from "../../../../../../modals/Attendance";

export async function GET(req: NextRequest, { params }: { params: { BthId: string } }) {
  try {
    // Establish database connection
    await dbConnect();

    const { BthId } = params;
    const sdkId = req.nextUrl.searchParams.get("sdkId");

    // Fetching classes matching the criteria and populating related data
    const clsList = await Classes.find({
      bthId: BthId,
      clsName: { $elemMatch: { isActive: true } },
    })
      .populate("bthId", "bthName")
      .populate("corId", "coNick");

    if (clsList.length > 0) {
      // Map classes and fetch attendance records
      const clsListWithAttendance = await Promise.all(
        clsList[0].clsName.map(async (cls: any) => {
          const attendanceRecords = await Attendance.find({
            bthId: BthId,
            clsId: cls._id,
            sdkId: sdkId,
          }).select("status absRemarks atdSrnShot");

          // Include attendance records only if they exist
          return {
            ...cls.toObject(),
            attendance: attendanceRecords.length > 0 ? attendanceRecords[0] : null,
          };
        })
      );

      return NextResponse.json({ clsList: clsListWithAttendance, success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, msg: "No classes found." }, { status: 404 });
    }
  } catch (error:any) {
    return NextResponse.json(
      { success: false, msg: `Error while fetching class data: ${error.message}` },
      { status: 500 }
    );
  }
}
