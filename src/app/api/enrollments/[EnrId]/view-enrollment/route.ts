import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Enrollments from "../../../../../../modals/Enrollments";

interface IEnrParams {
    EnrId?: string;
}

type EnrType = {
  enrRemarks: string;
  isApproved:string
};

export async function GET(req:NextRequest, {params}:{params:IEnrParams}){

    try 
    {  
      await dbConnect();
      const enrById = await Enrollments.findById(params.EnrId);

      if(!enrById){
        return NextResponse.json({ success: false, msg:"No enrollment found with the given id." }, {status:404});
      } else {
        return NextResponse.json({enrById, success: true }, {status:200});
      }     

    } catch (error) {
      return new NextResponse("Error while fetching enrData: " + error, {status:500});
    }
  }

export async function PATCH(req: NextRequest, {params}:{params:IEnrParams}) {

  try 
  {
    await dbConnect();
    const { enrRemarks, isApproved} : EnrType = await req.json();
    const enrById = await Enrollments.findByIdAndUpdate(params.EnrId, {enrRemarks, isApproved});

    if (enrById === "Rejected") { 
      return NextResponse.json({ enrById, success: true, msg: "Document rejected." }, { status: 200 }); 
    } else {
      return NextResponse.json({ enrById, success: true, msg: "Document approved." }, { status: 200 });
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

