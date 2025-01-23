import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Practices from "../../../../../../modals/Practices";

interface IPrcParams{
    PrcId?: string;
}

type PrcType = {
  prcName:string,
  prcImg:string,
  prcLang:string,
  prcDays:string,
  prcStartsAt:string,
  prcEndsAt:string,
  prcLink:string,
  prcWhatLink: string,
  usrId?:string
}

export async function PUT(req: NextRequest, {params}:{params:IPrcParams}) {

  try 
  {
    await dbConnect();
    const { prcName, prcLang, prcDays, prcStartsAt, prcEndsAt, prcLink, prcWhatLink,  prcImg, usrId }: PrcType = await req.json();
    const prcById = await Practices.findByIdAndUpdate(params.PrcId, {prcName, prcLang, prcDays, prcStartsAt, prcEndsAt, prcLink, prcWhatLink,  prcImg, usrId}, {runValidators:true});
    return NextResponse.json({ prcById, success: true, msg:"Practice class updated successfully." }, {status:200});

  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while updating course: " + error, {status: 400});
    }
  }
}

