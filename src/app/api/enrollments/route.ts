import Enrollments from "../../../../modals/Enrollments";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type EnrType = {
  _id?:string,
  enrTnsNo:string,
  enrSrnShot:string,
  enrRemarks:string,
  corId:string,
  bthId:string,
  createdBy:string,
  ttlJoiners?:number
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract query params correctly
    const corId = req.nextUrl.searchParams.get("corId");
    const bthId = req.nextUrl.searchParams.get("bthId");

    // Fetch enrollments with population
    let enrList: EnrType[] = await Enrollments.find()
      .populate("corId", "coName coNick coType")
      .populate("bthId", "bthName bthStart")
      .populate("createdBy", "sdkFstName sdkPhone")
      .lean() as unknown as EnrType[];

    // Apply filtering correctly
    if (corId || bthId) {
      enrList = enrList.filter((enr:any) => 
        (!corId || enr.corId._id.ToString() === corId) && 
        (!bthId || enr.bthId._id.ToString() === bthId)
      );
    }

    // Compute ttlJoiners asynchronously
    enrList = await Promise.all(
      enrList.map(async (doc) => {
        const ttlJoiners = await Enrollments.countDocuments({
          corId: doc.corId,
          bthId: doc.bthId,
        });
        return { ...doc, ttlJoiners };
      })
    );

    if (enrList.length > 0) {
      return NextResponse.json({ enrList, success: true }, { status: 200 });
    } else {
      return NextResponse.json({ msg: "No enrollments found", success: false }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error fetching enrollments:", error);
    return new NextResponse(`Error fetching enrollments: ${error.message}`, { status: 500 });
  }
}
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { enrTnsNo, enrSrnShot, enrRemarks, corId, bthId, createdBy }: EnrType = await req.json();
  
      const newEnr = new Enrollments({ enrTnsNo, enrSrnShot, enrRemarks, corId, bthId, createdBy});
      const savedEnr = await newEnr.save();

      if(savedEnr){
        return NextResponse.json({ savedEnr, success: true, msg:"Enrolled successfully." }, {status:200});
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