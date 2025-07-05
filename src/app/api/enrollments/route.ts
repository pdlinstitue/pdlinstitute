import Enrollments from "../../../../modals/Enrollments";
import Classes from "../../../../modals/Classes";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import mongoose from "mongoose";
import Attendance from "../../../../modals/Attendance";
import Reenrollments from "../../../../modals/Reenrollments";

type EnrType = {
  sdkId: string;
  enrTnsNo: string;
  cpnName: string;
  enrSrnShot: string;
  enrRemarks: string;
  corId: mongoose.Types.ObjectId;
  bthId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  ttlJoiners?: number;
  batchAttendance?: number;
  isReEnroll: boolean;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const corId = req.nextUrl.searchParams.get("corId");
    const bthId = req.nextUrl.searchParams.get("bthId");
    const duration = req.nextUrl.searchParams.get("dur");
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const filter: Record<string, any> = {};

    if (corId && mongoose.Types.ObjectId.isValid(corId)) {
      filter.corId = new mongoose.Types.ObjectId(corId);
    }
    if (bthId && mongoose.Types.ObjectId.isValid(bthId)) {
      filter.bthId = new mongoose.Types.ObjectId(bthId);
    }

    // Fetch enrollments with population
    let enrList = await Enrollments.find(filter)
      .populate("corId", "coName coNick coType")
      .populate("bthId", "bthName bthStart")
      .populate("sdkId", "sdkFstName sdkMdlName sdkLstName sdkPhone sdkRegNo")
      .populate("createdBy", "sdkFstName")
      .lean();

    if (duration) {
      enrList = enrList?.filter(
        (session: any) =>
          session?.isActive &&
          ((duration === "previous" && session.createdAt < today) ||
            (duration === "current" &&
              session.createdAt.setHours(0, 0, 0, 0) === today) ||
            (duration === "upcoming" && session.createdAt >= tomorrow)) ||
            (duration === "custom" &&
              startDate !== null &&
              endDate !== null &&
              session.createdAt >= new Date(startDate) &&
              session.createdAt <= new Date(endDate))
      );
    }

    // Compute ttlJoiners & batchAttendance in one loop
    const enrListWithStats = await Promise.all(
      enrList.map(async (enr) => {
        // Count total joiners
        const ttlJoiners = await Enrollments.countDocuments({
          corId: enr?.corId?._id,
          bthId: enr?.bthId?._id,
        });

        // Compute batch-wise attendance
        const classByBatch: any = await Classes.findOne({
          bthId: enr?.bthId?._id,
        }).lean();
        
        const totalClasses = classByBatch?.clsName?.length || 0;
        const classIds = classByBatch?.clsName?.map((a: any) => a._id) || [];

        const attendedClasses = await Attendance.countDocuments({
          //bthId: enr?.bthId,
          clsId: { $in: classIds },
          sdkId: enr?.sdkId?._id,
          status: "Present",
        });

        const batchAttendance =
          totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
        return { ...enr, ttlJoiners, batchAttendance };
      })
    );

    return NextResponse.json(
      { enrList: enrListWithStats, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching enrollments:", error);
    return new NextResponse(`Error fetching enrollments: ${error.message}`, {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const {
      enrTnsNo,
      cpnName,
      enrSrnShot,
      enrRemarks,
      corId,
      bthId,
      sdkId,
      createdBy,
      isReEnroll,
    }: EnrType = await req.json();

    const newEnr = new Enrollments({
      enrTnsNo,
      cpnName,
      enrSrnShot,
      enrRemarks,
      corId,
      bthId,
      sdkId,
      createdBy,
      isApproved:
        corId.toString() == "67d262857db737af7a47a679" ? "Approved" : "Pending",
    });
    const savedEnr = await newEnr.save();

    if (savedEnr) {
      if (isReEnroll) {
        const reenrollment = await Reenrollments.findOne({
          reqBy: sdkId,
          corId: corId,
        }).sort({ createdAt: -1 });

        if (reenrollment) {
          reenrollment.reqStatus = "ReEnrolled";
          await reenrollment.save();
        }
      }

      return NextResponse.json(
        { savedEnr, success: true, msg: "Enrolled successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { savedEnr, success: false, msg: "Enrollment failed." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return NextResponse.json(
        { success: false, msg: messages },
        { status: 400 }
      );
    } else {
      return new NextResponse("Error while saving enrData: " + error, {
        status: 400,
      });
    }
  }
}