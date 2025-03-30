import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Enrollments from "../../../../../../modals/Enrollments";

type EnrType = {
  enrRemarks: string;
  isApproved:string;
  updatedBy:string;
};

export async function GET(req: NextRequest,{ params }: { params: Promise<{ EnrId: string}> }){

    try 
    {  
      await dbConnect();
      const { EnrId } = await params;
      const enrById = await Enrollments.findById(EnrId);

      if(!enrById){
        return NextResponse.json({ success: false, msg:"No enrollment found with the given id." }, {status:404});
      } else {
        return NextResponse.json({enrById, success: true }, {status:200});
      }     

    } catch (error) {
      return new NextResponse("Error while fetching enrData: " + error, {status:500});
    }
  }

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ EnrId: string}> }) {

  try 
  {
    await dbConnect();
    const { EnrId } = await params;
    const { enrRemarks, isApproved, updatedBy} : EnrType = await req.json();

    if (!EnrId){
        return NextResponse.json({ success: false, msg: "No enrollment found with the given id." }, { status: 404 });
    } else {

      const enrById = await Enrollments.findByIdAndUpdate(EnrId, {enrRemarks, isApproved, updatedBy}, {new: true, runValidators: true});
      if (enrById === "Rejected") { 
        return NextResponse.json({ enrById, success: true, msg: "Enrollment dis-approved." }, { status: 200 }); 
      } else {
        return NextResponse.json({ enrById, success: true, msg: "Enrollment approved." }, { status: 200 });
      } 
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

