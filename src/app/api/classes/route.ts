import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Classes from "../../../../modals/Classes";
import Enrollments from "../../../../modals/Enrollments";
import Attendance from "../../../../modals/Attendance";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch all classes
        const clsList = await Classes.find()
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
        enrollmentCounts.forEach(({ _id, joinersCount }) => {
            const key = `${_id.corId}_${_id.bthId}`;
            countMap.set(key, joinersCount);
        });

        // Create a map for attendance counts
        const attendanceMap = new Map();
        attendanceCounts.forEach(({ _id, presentCount, absentCount }) => {
            const key = `${_id.bthId}_${_id.clsId}`;
            attendanceMap.set(key, { presentCount, absentCount });
        });

        // Attach joinersCount and attendance data to each class in clsList
        const clsListWithCounts = clsList.map(cls => {
            const joinersKey = `${cls.corId._id}_${cls.bthId._id}`;
            const joinersCount = countMap.get(joinersKey) || 0;
            
            const classAttendance = cls.clsName.map((session:any) => {
                const attendanceKey = `${cls.bthId._id}_${session._id}`;
                const { presentCount = 0, absentCount = 0 } = attendanceMap.get(attendanceKey) || {};
                return { ...session.toObject(), presentCount, absentCount };
            });

            return { ...cls.toObject(), joinersCount, clsName: classAttendance };
        });

        return NextResponse.json({ clsList: clsListWithCounts, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error while fetching clsData:", error);
        return new NextResponse("Error while fetching clsData: " + error, { status: 500 });
    }
}