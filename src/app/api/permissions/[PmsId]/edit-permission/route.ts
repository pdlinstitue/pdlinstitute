import { NextResponse, NextRequest } from "next/server";
import Permissions from "../../../../../../modals/Permissions";
import dbConnect from "../../../../../../dbConnect";

type PermitType = {
  atnId:string,
  rolId:string,
  isListEnabled:boolean,
  isAddEnabled:boolean,
  isEditEnabled:boolean,
  isDisEnabled:boolean,
  isDelEnabled:boolean,
  isMarkEnabled:boolean,
  isApvEnrEnabled:boolean,
  isMnlEnrEnabled:boolean,
  isCompEnabled:boolean,
  updatedBy: string
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ PmsId: string }>}) {

  try 
  {
    await dbConnect();
    const { PmsId } = await params;
    const { atnId, rolId, isAddEnabled, isListEnabled, isEditEnabled, isDisEnabled, isDelEnabled, isMarkEnabled, isApvEnrEnabled, isMnlEnrEnabled, isCompEnabled, updatedBy }: PermitType = await req.json();

    if(!PmsId){
      return NextResponse.json({success:false, msg: "No permission found." }, { status: 404 });
    }else{
      const pmsById = await Permissions.findByIdAndUpdate(PmsId, {atnId, rolId, isListEnabled, isAddEnabled, isEditEnabled, isDisEnabled, isDelEnabled, isMarkEnabled, isApvEnrEnabled, isMnlEnrEnabled, isCompEnabled, updatedBy}, {runValidators:true});
      return NextResponse.json({ pmsById, success: true, msg:"Permission updated successfully." }, {status:200});
    }
    
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving catData: " + error, {status: 500});
    }
  }
}

