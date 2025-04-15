import { NextResponse, NextRequest } from "next/server";
import Modules from "../../../../../../modals/Modules";
import dbConnect from "../../../../../../dbConnect";

type ActionType = {
    atnName:string, 
    listUrl:string,
    viewUrl:string,
    addUrl:string,
    editUrl:string,
    enableUrl:string,
    disableUrl:string,
    deleteUrl:string,
    amendUrl:string, 
    attdeesUrl:string, 
    attdImgUrl:string,
    markUrl:string,
    compUrl:string,
    apvEnrUrl:string,
    mnlEnrUrl:string,
    apvDocUrl:string,
    regPwdUrl:string,
    updatedBy: string,
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ AtnId: string }>}) {

  try 
  {
    await dbConnect();
    const { AtnId } = await params;
    const { atnName, listUrl, viewUrl, addUrl, editUrl, enableUrl, disableUrl, deleteUrl, markUrl, amendUrl, attdeesUrl, attdImgUrl, compUrl, apvEnrUrl, mnlEnrUrl, apvDocUrl, regPwdUrl, updatedBy }: ActionType = await req.json();

    if(!AtnId){
      return NextResponse.json({success:false, msg: "No action found." }, { status: 404 });
    }else{
      const atnById = await Modules.findByIdAndUpdate(AtnId, {atnName, listUrl, viewUrl, addUrl, editUrl, enableUrl, disableUrl, deleteUrl, markUrl, amendUrl, attdeesUrl, attdImgUrl, compUrl, apvEnrUrl, mnlEnrUrl, apvDocUrl, regPwdUrl, updatedBy}, {runValidators:true});
      return NextResponse.json({ atnById, success: true, msg:"Action updated successfully." }, {status:200});
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

