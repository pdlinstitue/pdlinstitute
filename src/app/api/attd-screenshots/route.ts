import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Screenshots from "../../../../modals/Screenshots";
import mongoose from "mongoose";
import { verifyApiToken } from "@/app/utils/verifyApiToken";


type ScreenshotsType = {
    _id?: string;
    bthId: string;
    clsId: string;
    uploadedBy:string;
    attdSreenShots: string[];
}

export async function GET(request: NextRequest) {
  try {

    await verifyApiToken(); 
    await dbConnect();

    const bthId = request.nextUrl.searchParams.get("bthId");
    const clsId = request.nextUrl.searchParams.get("clsId");

    if (!bthId || !mongoose.Types.ObjectId.isValid(bthId)) {
      return NextResponse.json({ success: false, msg: "Invalid or missing bthId" }, { status: 400 });
    }

    if (!clsId || !mongoose.Types.ObjectId.isValid(clsId)) {
      return NextResponse.json({ success: false, msg: "Invalid or missing clsId" }, { status: 400 });
    }

    const srnshots: ScreenshotsType[] = await Screenshots.find({
      bthId: new mongoose.Types.ObjectId(bthId),
      clsId: new mongoose.Types.ObjectId(clsId),
    })
      .populate("uploadedBy", "sdkFstName");

    if (srnshots.length === 0) {
      return NextResponse.json({ success: false, msg: "No screenshots found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, srnshots }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /screenshots:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch screenshots" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {

        await verifyApiToken(); 
        await dbConnect();
        const { bthId, clsId, attdSreenShots, uploadedBy } : ScreenshotsType = await request.json();

        const filter = { bthId, clsId, uploadedBy };
        const update = { $set: { attdSreenShots } };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const savedSrnShots = await Screenshots.findOneAndUpdate(filter, update, options);

        return NextResponse.json({ success: true, savedSrnShots, msg: "Screenshots uploaded successfully" }, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ error: "Failed to save screenshots" }, { status: 500 });
    }
}