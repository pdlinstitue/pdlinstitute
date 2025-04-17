import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";
import mongoose from "mongoose";
import Enrollments from "../../../../../../modals/Enrollments";

type BatchType = {
  bthName:string, 
  bthTime:string, 
  bthStart:Date, 
  bthEnd:Date, 
  corId:mongoose.Schema.Types.ObjectId, 
  bthVtr:string, 
  bthWhatGrp:string, 
  bthTeleGrp:string, 
  bthLang:string, 
  bthMode:string, 
  bthLink:string, 
  bthLoc:string, 
  bthBank:string, 
  bthQr:string,
}
  
export async function GET(req: NextRequest, { params }: { params: Promise<{ CorId: string }> }) {

  try {

    await dbConnect();
    const sdkId = req.nextUrl.searchParams.get("sdkId");
    const { CorId } = await params;

    if (!sdkId || !CorId) {
      return NextResponse.json(
        { success: false, msg: "Missing sdkId or CorId" },
        { status: 400 }
      );
    }

    const today = new Date();
    const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));


    // Step 1: Get all batches for the course with bthEnd >= today
    const allValidBatches = await Batches.find({
      corId: CorId,
      bthEnd: { $gte: utcToday },
    });

    if (!allValidBatches.length) {
      return NextResponse.json(
        { success: false, msg: "No valid batches found" },
        { status: 404 }
      );
    }

    const validBatchIds = allValidBatches.map((batch) => batch._id);

    // Step 2: Find which of these batches the sdkId is already enrolled in
    const alreadyEnrolledBatchIds = await Enrollments.find({
      sdkId: sdkId,
      bthId: { $in: validBatchIds },
      isApproved:{ $ne: "Rejected" },
    }).distinct("bthId");

    const enrolledBatchIds = alreadyEnrolledBatchIds.map((batch) => batch._id);

    // Step 3: Filter out batches the sdkId is already enrolled in
    const finalBatches = validBatchIds.filter(
      (batch) => !enrolledBatchIds.includes(batch)
    );

    if (!finalBatches.length) {
      return NextResponse.json(
        { success: false, msg: "No available batches (not already enrolled)" },
        { status: 404 }
      );
    }

    const batchDetails = await Batches.find({
      _id: { $in: finalBatches }});

    return NextResponse.json(
      { bthListByCourseId: batchDetails, success: true },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      "Error while fetching batches: " + error,
      { status: 500 }
    );
  }
}
  