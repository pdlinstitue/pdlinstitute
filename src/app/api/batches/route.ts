import Batches from "../../../../modals/Batches";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type BatchType = {
    bthName:String, 
    bthTime:String, 
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
    usrId:String
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const batchList:BatchType[] = await Batches.find().populate('corId', 'coName coNick');
      const bthList = batchList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ bthList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const {bthName, bthTime, bthStart, bthEnd, corId, bthVtr, bthWhatGrp, bthTeleGrp, bthLang, bthMode, bthLink, bthLoc, bthBank, bthQr, usrId}: BatchType = await req.json();
  
      const newBatche = new Batches({ bthName, bthTime, bthStart, bthEnd, corId, bthVtr, bthWhatGrp, bthTeleGrp, bthLang, bthMode, bthLink, bthLoc, bthBank, bthQr, usrId});
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