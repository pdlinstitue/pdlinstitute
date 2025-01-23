import { NextResponse, NextRequest } from "next/server";
import Assignments from "../../../../../../modals/Assignments";
import dbConnect from "../../../../../../dbConnect";

interface IAsnParams {
    AsnId?: string;
}

type AsnType = {
    _id:string,
    asnName: string, 
    asnType: string, 
    asnLink: string, 
    asnFile: string,
    asnOrder: string, 
    corId: string, 
    usrId?: string
}

export async function PUT(req: NextRequest, {params}:{params:IAsnParams}) {

  try 
  {
    await dbConnect();
    
    const { asnName, asnType, asnLink, asnFile, asnOrder, corId, usrId }: AsnType = await req.json();
    const asnById = await Assignments.findByIdAndUpdate(params.AsnId, {asnName, asnType, asnLink, asnFile, asnOrder, corId, usrId}, {runValidators:true});

    if(!asnById){
      return NextResponse.json({ message: "No assignment found." }, { status: 404 });
    }else{
        return NextResponse.json({ asnById, success: true, msg:"Assignment updated successfully." }, {status:200});
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

