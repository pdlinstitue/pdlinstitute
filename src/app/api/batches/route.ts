import Batches from "../../../../modals/Batches";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type BatchType = {
    bthName:String, 
    bthShift:String, 
    bthStart:Date, 
    bthEnd:Date, 
    corId:String, 
    bthVtr:String, 
    bthWhatGrp:String, 
    bthTeleGrp:String, 
    bthLang:String, 
    bthMode:String, 
    bthLink:String, 
    bthLoc:String, 
    bthBank:String, 
    bthQr:String,
    createdBy:String
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const bthList: BatchType[] = await Batches.find({ isActive: true })
      .populate('corId', 'coName coNick')
      .populate('bthVtr', 'sdkFstName')
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName');

      return NextResponse.json({ bthList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching batchData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
  try {

    await dbConnect();
    const {bthName, bthShift, bthStart, bthEnd, corId, bthVtr, bthWhatGrp, bthTeleGrp, bthLang, bthMode, bthLink, bthLoc, bthBank, bthQr, createdBy}: BatchType = await req.json();

    const newBatche = new Batches({ bthName, bthShift, bthStart, bthEnd, corId, bthVtr:bthVtr?bthVtr:null, bthWhatGrp, bthTeleGrp, bthLang, bthMode, bthLink, bthLoc, bthBank, bthQr, createdBy});
    const savedBatch = await newBatche.save();

    if(savedBatch){
      return NextResponse.json({ savedBatch, success: true, msg:"Batch created successfully." }, {status:200});
    }else{
      return NextResponse.json({ savedBatch, success: false, msg:"Batch creation failed." }, {status:200});
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