import Materials from "../../../../modals/Materials";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import mongoose from "mongoose";

type MaterialsType = {
  matName: string, 
  matType: string, 
  matLink: string, 
  matFile: string, 
  corId: string, 
  usrId?: string
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const matList:MaterialsType[] = await Materials.find().populate('corId', 'coName coNick');
      const materialList = matList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ matList:materialList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) { 
try 
  {
    await dbConnect();
    const {matName, matType, corId, matLink, matFile, usrId}: MaterialsType = await req.json();
    
    // // Convert corId to a valid ObjectId 
    // const corObjectId = new mongoose.Types.ObjectId(corId);

    const newMaterial = new Materials({ matName, matType, corId, matLink, matFile, usrId});
    const savedMaterial = await newMaterial.save();

    if(savedMaterial){
      return NextResponse.json({ savedMaterial, success: true, msg:"Study material created successfully." }, {status:200});
    }else{
      return NextResponse.json({ savedMaterial, success: false, msg:"Study material creation failed." }, {status:200});
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving matData: " + error, {status: 400});
    }
  }
}