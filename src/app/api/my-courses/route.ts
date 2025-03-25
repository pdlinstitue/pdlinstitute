import mongoose from "mongoose";
import Courses from "../../../../modals/Courses";
import Enrollments from "../../../../modals/Enrollments";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Categories from "../../../../modals/Categories";

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

        // Step 2: Filter courses based on eligibility
        const filteredCourses = [];

        for (const course of allCourses) {
            // Check if the user is already enrolled in this course
            const enrollment = await Enrollments.findOne({
                createdBy: sdkObjectId,
                corId: course._id,
            });

            // Skip the course if the user is enrolled and has completed it
            if (enrollment && enrollment.isCompleted === "Complete") {
                continue;
            }

            if (course.coElg === "None") {
                filteredCourses.push({ ...course, eligibilityName:"None" });
                continue;
            }

            let eligibilityName = "";

            if (course.coElgType === "Course") {                
                const isCompleted = await Enrollments.exists({
                    createdBy: sdkObjectId,
                    corId: course.coElg,
                    isCompleted: "Complete",
                });

                const eligibleCourse = await Courses.findById(course.coElg, "coNick");
                eligibilityName = eligibleCourse ? eligibleCourse.coNick : "Unknown Course";

                if (isCompleted) {
                    filteredCourses.push({ ...course, eligibilityName });
                }
            } else if (course.coElgType === "Category") {
                const categoryCourses = await Courses.find({ coCat: course.coElg }).lean();
                const categoryCourseIds = categoryCourses.map((catCourse) => new mongoose.Types.ObjectId(catCourse._id as string));
                const completedCount = await Enrollments.countDocuments({
                    createdBy: sdkObjectId,
                    corId: { $in: categoryCourseIds },
                    isCompleted: "Complete",
                });

                const eligibleCategory = await Categories.findById(course.coElg, "catName");
                eligibilityName = eligibleCategory ? eligibleCategory.catName : "Unknown Category";

                if (completedCount === categoryCourses.length) {
                    filteredCourses.push({ ...course, eligibilityName });
                }
            }
        }

        // Step 3: Filter only active courses
        const activeCourseList = filteredCourses.filter((item:any) => item.isActive === true);
        return NextResponse.json({ coList: activeCourseList, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error while fetching course data", details: error }, { status: 500 });
    }
}