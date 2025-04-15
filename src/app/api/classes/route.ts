import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Classes from "../../../../modals/Classes";
import Enrollments from "../../../../modals/Enrollments";
import Attendance from "../../../../modals/Attendance";
import mongoose from "mongoose";

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

        // Fetch all classes
        const clsList = await Classes.find(filter)
            .populate('corId', 'coName coNick')
            .populate('bthId', 'bthName')
            .populate('clsName.createdBy', 'sdkFstName')
            .populate('clsName.updatedBy', 'sdkFstName');

        // Aggregate enrollments to count joiners for each corId and bthId
        const enrollmentCounts = await Enrollments.aggregate([
            {
                $group: {
                    _id: { corId: "$corId", bthId: "$bthId" },
                    joinersCount: { $sum: 1 }
                }
            }
        ]);

        // Aggregate attendance to count present and absent students
        const attendanceCounts = await Attendance.aggregate([
            {
                $group: {
                    _id: { bthId: "$bthId", clsId: "$clsId" },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } }
                }
            }
        ]);

        // Create a map for quick lookup of joinersCount
        const countMap = new Map();
        enrollmentCounts?.forEach(({ _id, joinersCount }) => {
            const key = `${_id.corId}_${_id.bthId}`;
            countMap.set(key, joinersCount);
        });

        // Create a map for attendance counts
        const attendanceMap = new Map();
        attendanceCounts?.forEach(({ _id, presentCount, absentCount }) => {
            const key = `${_id.bthId}_${_id.clsId}`;
            attendanceMap.set(key, { presentCount, absentCount });
        });

        // Attach joinersCount and attendance data to each class in clsList
        const clsListWithCounts = clsList?.map(cls => {
            const joinersKey = `${cls.corId?._id}_${cls.bthId?._id}`;
            const joinersCount = countMap.get(joinersKey) || 0;        
            // Ensure cls.clsName is an array before filtering and mapping
            const classAttendance = Array.isArray(cls.clsName) 
              ? cls.clsName
                  .filter((session:any) => session?.isActive) // Use filter instead of find()
                  .map((session:any) => {
                    const attendanceKey = `${cls.bthId?._id}_${session._id}`;
                    const { presentCount = 0, absentCount = 0 } = attendanceMap.get(attendanceKey) || {};
                    return { ...session.toObject(), presentCount, absentCount };
                  })
              : [];
          
            return { ...cls.toObject(), joinersCount, clsName: classAttendance };
          });          

        return NextResponse.json({ clsList: clsListWithCounts, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error while fetching clsData:", error);
        return new NextResponse("Error while fetching clsData: " + error, { status: 500 });
    }
}

export async function POST(req:NextRequest) {
    
    try {
        await dbConnect();
        
        const { clsName, bthId, corId }  = await req.json();

        if (!bthId || !corId) {
            return NextResponse.json({ success:false,msg: "Batch and Course are required." }, { status: 400 });
        }

        const newClass = new Classes({
            clsName,
            bthId,
            corId
        });

        await newClass.save();
        return NextResponse.json({success:true, msg: "Classes created successfully", class: newClass }, { status: 201 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}