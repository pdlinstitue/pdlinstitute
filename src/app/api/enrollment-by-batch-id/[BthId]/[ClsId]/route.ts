import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Enrollments from "../../../../../../modals/Enrollments";
import Attendance from "../../../../../../modals/Attendance";
import Classes from "../../../../../../modals/Classes";
import mongoose from "mongoose";

function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes + minutesToAdd, 0, 0);
    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${newHours}:${newMinutes}`;
}

function subMinutesToTime(timeStr: string, minutesToSub: number): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes - minutesToSub, 0, 0);
    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${newHours}:${newMinutes}`;
}

const convertDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr); // Already a valid ISO date
    const formattedTime = timeStr.replace('.', ':');
    const [hours, minutes] = formattedTime.split(':').map(Number);

    // Set hours and minutes safely
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ BthId: string, ClsId: string }> }) {

    try {
        await dbConnect();
        const { BthId, ClsId } = await params;
        // Convert params to ObjectId if necessary
        const batchId = new mongoose.Types.ObjectId(BthId);
        const classId = new mongoose.Types.ObjectId(ClsId);

        // Fetch enrollments
        const enrByBatchId = await Enrollments.find({ bthId: batchId }).populate("sdkId", "sdkFstName sdkPhone");        

        if (!enrByBatchId || enrByBatchId.length === 0) {
            return NextResponse.json({ msg: "No enrollment found." }, { status: 404 });
        }

        const clsData = await Classes.find();
        let clsStartAt: Date;
        let clsEndAt: Date;
        
        for (const cls of clsData) {
            const match = cls.clsName.find((c: any) => c._id.toString() === classId.toString());
            if (match) {
                clsStartAt = convertDateTime(match.clsDate, addMinutesToTime(match.clsStartAt, 10));
                clsEndAt = convertDateTime(match.clsDate, subMinutesToTime(match.clsEndAt, 10));
                break;
            }
        }

        // Fetch attendance details for each enrollment
        const enrichedEnrollments = await Promise.all(
            enrByBatchId.map(async (enrollment) => {
                const attendanceRecord = await Attendance.findOne({
                    bthId: batchId,
                    clsId: classId,
                    sdkId: enrollment.sdkId._id,
                });

                return {
                    ...enrollment.toObject(),
                    attendanceStatus: attendanceRecord ? attendanceRecord.status : "Pending",
                    attendanceRemark: attendanceRecord ? attendanceRecord.absRemarks : "",
                    clsStartAt,
                    clsEndAt,
                };
            })
        );

        return NextResponse.json({ enrollments: enrichedEnrollments, success: true }, { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching enrollment data: " + error, { status: 500 });
    }
}