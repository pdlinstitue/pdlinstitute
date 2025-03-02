import { NextResponse, NextRequest } from "next/server";
import Batches from "../../../../../../modals/Batches";
import dbConnect from "../../../../../../dbConnect";

interface IBthParams{
    BthId?: string;
}

type BatchType =  {
    _id?:string,
    bthName:string, 
    bthShift:string, 
    bthStart:Date, 
    bthEnd:Date, 
    corId:string, 
    bthVtr:string, 
    bthWhatGrp:string, 
    bthTeleGrp:string, 
    bthLang:string, 
    bthMode:string, 
    bthLink:string, 
    bthLoc:string, 
    bthBank:string, 
    bthQr:string,
    updatedBy?:string
}

export async function PUT(req: NextRequest, {params}:{params:IBthParams}) {

  try 
  {
    await dbConnect();
    
    const { bthName, bthShift, bthStart, bthEnd, corId, bthVtr, bthWhatGrp, bthTeleGrp, bthLang, bthMode, bthLink, bthLoc, bthBank, bthQr, updatedBy }: BatchType = await req.json();
    const bthById = await Batches.findByIdAndUpdate(params.BthId, {bthName, bthShift, bthStart, bthEnd, corId, bthVtr, bthWhatGrp, bthTeleGrp, bthLang, bthMode, bthLink, bthLoc, bthBank, bthQr, updatedBy}, {runValidators:true});

    if(!bthById){
      return NextResponse.json({ msg: "No batch found." }, { status: 404 });
    }else{
        return NextResponse.json({ bthById, success: true, msg:"batch updated successfully." }, {status:200});
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

