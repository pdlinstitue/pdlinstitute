import mongoose from "mongoose";
import Courses from "../../../../modals/Courses";
import Enrollments from "../../../../modals/Enrollments";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

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
            if (course.coElg === "None") {
                filteredCourses.push(course);
                continue;
            }

            if (course.coElgType === "Course") {
                // Convert course eligibility ID to ObjectId
                const coElgId = new mongoose.Types.ObjectId(course.coElg);

                // Check if user has completed the required course
                const isCompleted = await Enrollments.exists({
                    createdBy: sdkObjectId,
                    corId: coElgId,
                    isCompleted: true,
                });

                if (isCompleted) {
                    filteredCourses.push(course);
                }
            } else if (course.coElgType === "Category") {
                // Find all courses within this category
                const categoryCourses = await Courses.find({ coCat: course.coElg }).lean();
                const categoryCourseIds = categoryCourses.map((catCourse:any) => new mongoose.Types.ObjectId(catCourse._id));

                // Count how many of the category courses are completed
                const completedCount = await Enrollments.countDocuments({
                    createdBy: sdkObjectId,
                    corId: { $in: categoryCourseIds },
                    isCompleted: true,
                });

                // If all category courses are completed, allow access
                if (completedCount === categoryCourses.length) {
                    filteredCourses.push(course);
                }
            }
        }

        // Step 3: Filter only active courses
        const activeCourseList = filteredCourses.filter((item) => item.isActive === true);
        return NextResponse.json({ coList: activeCourseList, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Error while fetching course data", details: error }, { status: 500 });
    }
}
