import mongoose from "mongoose";
import Courses from "../../../../modals/Courses";
import Enrollments from "../../../../modals/Enrollments";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Categories from "../../../../modals/Categories";
import Reenrollments from "../../../../modals/Reenrollments";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const sdkId = req.nextUrl.searchParams.get("sdkid");

        if (!sdkId) {
            return NextResponse.json({ error: "Missing sdkid parameter" }, { status: 400 });
        }

        const sdkObjectId = new mongoose.Types.ObjectId(sdkId); // Convert sdkId to ObjectId

        // Step 1: Fetch all courses
        const allCourses = await Courses.find().populate("coCat", "catName").lean();

        // Step 2: Filter courses based on completion status
        const completedCourses = [];

        for (const course of allCourses) {
            // Check if the user is enrolled and has completed the course
            const enrollment = await Enrollments.findOne({
                createdBy: sdkObjectId,
                corId: course._id,
                isApproved: "Approved",
                isCompleted: "Complete",
            });

            if (enrollment) {
                // Fetch eligibility name
                let eligibilityName = "None";
                if (course.coElgType === "Course" && course.coElg !== "None") {
                    const eligibleCourse = await Courses.findById(course.coElgId, "coNick");
                    eligibilityName = eligibleCourse ? eligibleCourse.coNick : "Unknown Course";
                } else if (course.coElgType === "Category" && course.coElg !== "None") {
                    const eligibleCategory = await Categories.findById(course.coElg, "catName");
                    eligibilityName = eligibleCategory ? eligibleCategory.catName : "Unknown Category";
                } else {
                    eligibilityName = course.coElg;
                }

                // Fetch reqStatus from reenrollments
                const reenrollment = await Reenrollments.findOne({
                    sdkId: sdkObjectId,
                    corId: course._id,
                });

                completedCourses.push({
                    ...course,
                    eligibilityName,
                    reqStatus: reenrollment ? reenrollment.reqStatus : null,
                });
            }
        }

        return NextResponse.json({ coList: completedCourses, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error while fetching course data", details: error }, { status: 500 });
    }
}
