import Documents from "../../../../modals/Documents";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Users from "../../../../modals/Users";

type DocType = {
  sdkDocType: string;
  sdkDocOwnr: string;
  sdkUpldDate: Date;
  sdkDocStatus: boolean;
  sdkAprDate: Date;
  sdkRemarks: string;
  sdkDocRel: string;
  sdkPan: string;
  sdkPanNbr: string;
  sdkIdProof: string;
  sdkIdNbr: string;
  sdkAdsProof: string;
  sdkAdsNbr: string;
  createdBy?: string;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get("usrId");
    if (!userId) {
      return NextResponse.json({ success: false, msg: "User ID is required." }, { status: 400 });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, msg: "User not found." }, { status: 404 });
    }

    const docList: DocType[] = await Documents.find({ isActive: true })
      .populate("createdBy", "sdkFstName sdkMdlName sdkLstName sdkPhone sdkRegNo")
      .populate("updatedBy", "sdkFstName");

    const filteredDocs = docList.filter((doc: any) => {
      if (user.isAdmin === "Yes") return true;
      return doc.createdBy?._id?.toString() === userId;
    });

    const panList = filteredDocs.filter((item: any) => item.sdkDocType === "Pan");
    const idList = filteredDocs.filter((item: any) => item.sdkDocType === "Id");
    const adsList = filteredDocs.filter((item: any) => item.sdkDocType === "Ads");

    if (panList.length > 0 || idList.length > 0 || adsList.length > 0) {
      return NextResponse.json({ panList, idList, adsList, success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, msg: "No Document found." }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ success: false, msg: "Error while fetching documents.", error: error.toString() }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const {
      sdkDocType,
      sdkDocOwnr,
      sdkDocRel,
      sdkPan,
      sdkPanNbr,
      sdkIdProof,
      sdkIdNbr,
      sdkAdsProof,
      sdkAdsNbr,
      createdBy,
    }: DocType = await req.json();

    const newDocs = new Documents({
      sdkDocType,
      sdkDocOwnr,
      sdkDocRel,
      sdkPan,
      sdkPanNbr,
      sdkIdProof,
      sdkIdNbr,
      sdkAdsProof,
      sdkAdsNbr,
      createdBy,
    });

    const savedDocs = await newDocs.save();

    if (savedDocs) {
      return NextResponse.json({ savedDocs, success: true, msg: "Document uploaded successfully." }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, msg: "Document uploading failed." }, { status: 400 });
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    } else {
      return new NextResponse("Error while saving data: " + error, { status: 500 });
    }
  }
}
