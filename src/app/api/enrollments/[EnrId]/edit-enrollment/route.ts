import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Enrollments from "../../../../../../modals/Enrollments";

type EnrType = {
  enrIncompRemarks: string;
  isCompleted:string;
  updatedBy:string;
};

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ EnrId: string}> }) {

  try 
  {
    await dbConnect();
    const { EnrId } = await params;
    const { enrIncompRemarks, isCompleted, updatedBy} : EnrType = await req.json();

    if (!EnrId){
        return NextResponse.json({ success: false, msg: "No enrollment found." }, { status: 404 });
    } else {

      const enrById = await Enrollments.findByIdAndUpdate(EnrId, {enrIncompRemarks, isCompleted, updatedBy}, {new: true, runValidators: true});
      if (isCompleted === "Complete") { 
        return NextResponse.json({ enrById, success: true, msg: "Marked complete." }, { status: 200 }); 
      } else {
        return NextResponse.json({ enrById, success: true, msg: "Marked incomplete." }, { status: 200 });
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

