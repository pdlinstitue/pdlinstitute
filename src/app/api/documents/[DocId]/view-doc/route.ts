import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Documents from "../../../../../../modals/Documents";

interface IDocParams{
    DocId?: string;
}

type DocType = {
  _id?: string;
  sdkDocStatus: string;
  sdkAprDate: Date;
  sdkRemarks: string;
  sdkPanNbr: string;
  sdkIdNbr:string;
  sdkAdsNbr:string;
};

export async function GET(req:NextRequest, {params}:{params:IDocParams}){

    try 
    {  
      await dbConnect();
      const docById = await Documents.findById(params.DocId);
      return NextResponse.json({ docById, success: true }, {status:200});

    } catch (error) {
      return new NextResponse("Error while fetching docData: " + error, {status:500});
    }
  }

export async function PATCH(req: NextRequest, {params}:{params:IDocParams}) {

  try 
  {
    await dbConnect();
    const { sdkDocStatus, sdkRemarks, sdkPanNbr, sdkIdNbr, sdkAdsNbr, sdkAprDate } : DocType = await req.json();
    const docById = await Documents.findByIdAndUpdate(params.DocId, {sdkDocStatus, sdkRemarks, sdkPanNbr, sdkIdNbr, sdkAdsNbr, sdkAprDate});

    if (sdkDocStatus === "Rejected") { 
      return NextResponse.json({ docById, success: true, msg: "Document dis-approved." }, { status: 200 }); 
    } else {
      return NextResponse.json({ docById, success: true, msg: "Document approved." }, { status: 200 });
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

