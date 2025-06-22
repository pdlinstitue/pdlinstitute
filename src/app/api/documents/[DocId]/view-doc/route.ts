import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Documents from "../../../../../../modals/Documents";

type DocType = {
  _id?: string;
  sdkDocStatus: string;
  sdkAprDate: Date;
  sdkRemarks: string;
  sdkPanNbr: string;
  sdkIdNbr:string;
  sdkAdsNbr:string;
  updatedBy:string
};

export async function GET(req: NextRequest,{ params }: { params: Promise<{ DocId: string}> }){

    try 
    {  
      await dbConnect();
      const { DocId } = await params;
      const docById = await Documents.findById(DocId);

      if (!docById) { 
        return  NextResponse.json({success:false, msg:"No Document Found."}, {status:404}); 
      } else {
        return NextResponse.json({ docById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching docData: " + error, {status:500});
    }
  }

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ DocId: string}> }) {

  try 
  {
    await dbConnect();
    const { DocId } = await params;

    if (!DocId) {
      return NextResponse.json({ success: false, msg: "No Document Found." }, { status: 404 });
    } else {
      const { sdkDocStatus, sdkRemarks, sdkPanNbr, sdkIdNbr, sdkAdsNbr, sdkAprDate, updatedBy } : DocType = await req.json();
      const docById = await Documents.findByIdAndUpdate(DocId, {sdkDocStatus, sdkRemarks, sdkPanNbr, sdkIdNbr, sdkAdsNbr, sdkAprDate, updatedBy});

      if (sdkDocStatus === "Rejected") { 
        return NextResponse.json({ docById, success: true, msg: "Document dis-approved." }, { status: 200 }); 
      } else {
        return NextResponse.json({ docById, success: true, msg: "Document approved." }, { status: 200 });
      } 
    }  
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving data: " + error, {status: 400});
    }
  }
}

