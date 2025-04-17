import Enrollments from "../../../../modals/Enrollments";
import Classes from "../../../../modals/Classes";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import mongoose from "mongoose";
import Attendance from "../../../../modals/Attendance";

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
};

export async function GET(req: NextRequest) {

  try {

    await dbConnect();
    const corId = req.nextUrl.searchParams.get("corId");
    const bthId = req.nextUrl.searchParams.get("bthId");
    const durInMonth = Number(req.nextUrl.searchParams.get("dur"));

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - durInMonth);

    const filter: Record<string, any> = { createdAt: { $gte: startDate } };
    
    if (corId && mongoose.Types.ObjectId.isValid(corId)) {
      filter.corId = new mongoose.Types.ObjectId(corId);
    }
    if (bthId && mongoose.Types.ObjectId.isValid(bthId)) {
      filter.bthId = new mongoose.Types.ObjectId(bthId);
    }

    // Fetch enrollments with population
    const enrList = await Enrollments.find(filter)
      .populate("corId", "coName coNick coType")
      .populate("bthId", "bthName bthStart")
      .populate("sdkId", "sdkFstName sdkPhone sdkRegNo")
      .populate("createdBy", "sdkFstName")
      .lean();

    const batchClassCounts: Record<string, number> = {};
    const batchClassIds: Record<string, mongoose.Types.ObjectId[]> = {};

    const classes = await Classes.find({ bthId: { $exists: true } }).lean();

    classes.forEach((cls) => {
      const batchId = cls.bthId.toString();
      if (!batchClassCounts[batchId]) {
        batchClassCounts[batchId] = 0;
        batchClassIds[batchId] = [];
      }

      if (cls.clsName && Array.isArray(cls.clsName)) {
        batchClassCounts[batchId] += cls.clsName.length; // Count total classes
        batchClassIds[batchId].push(...cls.clsName.map((c: any) => c._id)); // Store all class IDs
      }
    });

    // Compute ttlJoiners & batchAttendance in one loop
    const enrListWithStats = await Promise.all(
      enrList.map(async (enr) => {
        // Count total joiners
        const ttlJoiners = await Enrollments.countDocuments({
          corId: enr?.corId,
          bthId: enr?.bthId,
        });

        // Compute batch-wise attendance
        const totalClasses = batchClassCounts[enr?.bthId?._id] || 0;
        const classIds = batchClassIds[enr?.bthId?._id] || [];

        const attendedClasses = await Attendance.countDocuments({
          bthId: enr?.bthId,
          clsId: { $in: classIds },
          sdkId: enr?.createdBy?._id,
          status: "Present",
        });

        const batchAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
        return { ...enr, ttlJoiners, batchAttendance };
      })
    );

    return NextResponse.json({ enrList: enrListWithStats, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching enrollments:", error);
    return new NextResponse(`Error fetching enrollments: ${error.message}`, { status: 500 });
  }
}
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { enrTnsNo, cpnName, enrSrnShot, enrRemarks, corId, bthId, sdkId, createdBy }: EnrType = await req.json();
  
      const newEnr = new Enrollments({ enrTnsNo, cpnName, enrSrnShot, enrRemarks, corId, bthId, sdkId, createdBy, isApproved:corId.toString()=="67d262857db737af7a47a679"?"Approved":"Pending"});
      const savedEnr = await newEnr.save();

      if(savedEnr){
        return NextResponse.json({ savedEnr, success: true, msg:"Enrolled successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedEnr, success: false, msg:"Enrollment failed." }, {status:200});
      }
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving enrData: " + error, {status: 400});
      }
    }
}