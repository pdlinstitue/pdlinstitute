import { NextResponse, NextRequest } from "next/server";
import Documents from "../../../../../../modals/Documents";
import dbConnect from "../../../../../../dbConnect";

type DocType = {
    _id?: string;
    sdkDocOwnr: string;
    sdkDocRel: string;
    sdkUpldDate: Date;
    sdkPan: string;
    sdkPanNbr: string;
    sdkIdProof: string;
    sdkIdNbr: string;
    sdkAdsProof: string;
    sdkAdsNbr : string;
    updatedBy: string;
  };

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ DocId: string}> }) {

  try 
  {
    await dbConnect();
    const { DocId } = await params;

    if (!DocId) {
      return NextResponse.json({ success: false, msg: "No Document Found." }, { status: 404 });
    } else {
      const { sdkDocOwnr, sdkUpldDate, sdkDocRel, sdkPan, sdkPanNbr, sdkIdProof, sdkIdNbr, sdkAdsProof, sdkAdsNbr, updatedBy }: DocType = await req.json();
      const docById = await Documents.findByIdAndUpdate(DocId, {sdkDocOwnr, sdkUpldDate, sdkDocRel, sdkPan, sdkPanNbr, sdkIdProof, sdkIdNbr, sdkAdsProof, sdkAdsNbr, updatedBy});
      return NextResponse.json({ docById, success: true, msg:"Document updated successfully." }, {status:200});
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while updating document: " + error, {status: 400});
    }
  }
}

