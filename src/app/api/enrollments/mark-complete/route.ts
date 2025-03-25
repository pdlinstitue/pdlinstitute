import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../dbConnect";
import Enrollments from "../../../../../modals/Enrollments";

export async function PATCH(req:NextRequest) {
    try {
      await dbConnect();
      const { enrollmentIds } = await req.json();
  
      if (!enrollmentIds || !Array.isArray(enrollmentIds)) {
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
      }
  
      // Update enrollments in bulk
      const result = await Enrollments.updateMany(
        { _id: { $in: enrollmentIds } },
        { $set: { isCompleted: "Complete" } }
      );
  
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
      console.error("Error updating enrollments:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }