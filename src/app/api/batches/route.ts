import Batches from "../../../../modals/Batches";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import { verifyApiToken } from "@/app/utils/auth";

type BatchType = {
  bthName: String;
  bthShift: String;
  bthStart: Date;
  bthEnd: Date;
  corId: String;
  bthVtr: String;
  bthWhatGrp: String;
  bthTeleGrp: String;
  bthLang: String;
  bthMode: String;
  bthLink: String;
  bthLoc: String;
  bthBank: String;
  bthQr: String;
  createdBy: String;
};

export async function GET(req: NextRequest) {
  try {

    await verifyApiToken(); 
    const duration = req.nextUrl.searchParams.get("dur");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await dbConnect();
    let bthList: BatchType[] = await Batches.find({ isActive: true })
      .populate("corId", "coName coNick")
      .populate("bthVtr", "sdkFstName")
      .populate("createdBy", "sdkFstName")
      .populate("updatedBy", "sdkFstName")
      .sort({ createdAt: -1 });

    if (duration) {
      bthList = bthList?.filter(
        (bth: any) =>
          bth?.isActive &&
          ((duration === "previous" && bth.bthStart < today) ||
            (duration === "current" &&
              bth.bthStart.setHours(0, 0, 0, 0) === today) ||
            (duration === "upcoming" && bth.bthStart >= tomorrow))
      );
    }
    
    if (Array.isArray(bthList) && bthList.length > 0) {
      return NextResponse.json({ bthList, success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, msg: "No batch found." },
        { status: 404 }
      );
    }
  } catch (error) {
    return new NextResponse("Error while fetching batchData: " + error, {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {

    await verifyApiToken(); 
    await dbConnect();
    const {
      bthName,
      bthShift,
      bthStart,
      bthEnd,
      corId,
      bthVtr,
      bthWhatGrp,
      bthTeleGrp,
      bthLang,
      bthMode,
      bthLink,
      bthLoc,
      bthBank,
      bthQr,
      createdBy,
    }: BatchType = await req.json();

    const newBatche = new Batches({
      bthName,
      bthShift,
      bthStart,
      bthEnd,
      corId,
      bthVtr: bthVtr ? bthVtr : null,
      bthWhatGrp,
      bthTeleGrp,
      bthLang,
      bthMode,
      bthLink,
      bthLoc,
      bthBank,
      bthQr,
      createdBy,
    });
    const savedBatch = await newBatche.save();

    if (savedBatch) {
      return NextResponse.json(
        { savedBatch, success: true, msg: "Batch created successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { savedBatch, success: false, msg: "Batch creation failed." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return NextResponse.json(
        { success: false, msg: messages },
        { status: 400 }
      );
    } else {
      return new NextResponse("Error while saving data: " + error, {
        status: 400,
      });
    }
  }
}