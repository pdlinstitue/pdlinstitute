import Documents from "../../../../modals/Documents";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type DocType = {
    sdkName: string;
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
    usrId?: string;
  };

export async function GET(req:NextRequest){
    try 
    { 
      await dbConnect();
      const docList:DocType[] = await Documents.find().populate('usrId', 'sdkName');
      const activeDocList = docList.filter((item:any)=> item.isActive === true);

      const panList = activeDocList.filter((item: any) => item.sdkDocType === 'Pan');
      const idList = activeDocList.filter((item: any) => item.sdkDocType === 'Id');
      const adsList = activeDocList.filter((item: any) => item.sdkDocType === 'Ads');

      if(panList.length > 0 || idList.length > 0 || adsList.length > 0){
          return NextResponse.json({ panList, idList, adsList, success: true }, {status:200});
      } else {
        return new NextResponse("No Document found.", {status:404});
      }    
      
    } catch (error) {
      return new NextResponse("Error while fetching docData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const {sdkDocType, sdkDocOwnr, sdkDocRel, sdkPan, sdkPanNbr, sdkIdProof, sdkIdNbr, sdkAdsProof, sdkAdsNbr, usrId }: DocType = await req.json();
  
      const newDocs = new Documents({ sdkDocType, sdkDocOwnr, sdkDocRel, sdkPan, sdkPanNbr, sdkIdProof, sdkIdNbr, sdkAdsProof, sdkAdsNbr, usrId});
      const savedDocs = await newDocs.save();

      if(savedDocs){
        return NextResponse.json({ savedDocs, success: true, msg:"Document created successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedDocs, success: false, msg:"Document creation failed." }, {status:200});
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