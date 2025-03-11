import Enrollments from "../../../../modals/Enrollments";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type EnrType = {
  enrTnsNo:string,
  enrSrnShot:string,
  enrRemarks:string,
  corId:string,
  bthId:string,
  createdBy:string,
  ttlJoiners?:number
}

export async function GET(req:NextRequest){

  try {

    await dbConnect();
    // Fetch enrollments and populate required fields
    let enrList: EnrType[] = await Enrollments.find() 
      .populate("corId", "coName coType")
      .populate("bthId", "bthName bthStart")
      .populate("createdBy", "sdkFstName sdkPhone")
      .lean() as unknown as EnrType[]; // Convert to plain objects for modification

    // Compute ttlJoiners asynchronously
    enrList = await Promise.all(
      enrList.map(async (doc) => {
        const ttlJoiners = await Enrollments.countDocuments({
          bthId: doc.bthId,
          corId: doc.corId,
        });
        return { ...doc, ttlJoiners };
      })
    );

    if (enrList && enrList.length > 0){
      return NextResponse.json({ enrList, success: true }, {status:200});     
    }else {
      return NextResponse.json({ msg: "No enrollments found", success: false }, { status: 404 });
    }      
  } catch (error) {
    return new NextResponse("Error while fetching enrData: " + error, {status:500});
  }
}
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { enrTnsNo, enrSrnShot, enrRemarks, corId, bthId, createdBy }: EnrType = await req.json();
  
      const newEnr = new Enrollments({ enrTnsNo, enrSrnShot, enrRemarks, corId, bthId, createdBy});
      const savedEnr = await newEnr.save();

      if(savedEnr){
        return NextResponse.json({ savedEnr, success: true, msg:"Enrollment done successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedEnr, success: false, msg:"Enrollment failed." }, {status:200});
      }
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving enrData: " + error, {status: 400});
      }
    }
}