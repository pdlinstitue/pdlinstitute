import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Practices from "../../../../../../modals/Practices";

type PrcType = {
  prcName:string,
  prcImg:string,
  prcLang:string,
  prcDays:string,
  prcStartsAt:string,
  prcEndsAt:string,
  prcLink:string,
  prcWhatLink: string,
  updatedBy?:string
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ PrcId: string}> }) {

  try 
  {
    await dbConnect();
    const { PrcId } = await params;

    if(!PrcId){
      return NextResponse.json({ success: false, msg: "No practice class found." }, { status: 404 });
    } else {
      const { prcName, prcLang, prcDays, prcStartsAt, prcEndsAt, prcLink, prcWhatLink,  prcImg, updatedBy }: PrcType = await req.json();
      const prcById = await Practices.findByIdAndUpdate(PrcId, {prcName, prcLang, prcDays, prcStartsAt, prcEndsAt, prcLink, prcWhatLink,  prcImg, updatedBy}, {runValidators:true});
      return NextResponse.json({ prcById, success: true, msg:"Practice class updated successfully." }, {status:200});
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while updating course: " + error, {status: 400});
    }
  }
}

