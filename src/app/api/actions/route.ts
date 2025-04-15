import Modules from "../../../../modals/Modules";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type ActionType = {
  atnName:string, 
  listUrl:string,
  viewUrl:string,
  addUrl:string,
  editUrl:string,
  enableUrl:string,
  disableUrl:string,
  deleteUrl:string,
  attdeesUrl:string,
  attdImgUrl:string,
  amendUrl:string,
  markUrl:string,
  compUrl:string,
  apvEnrUrl:string,
  mnlEnrUrl:string,
  apvDocUrl:string,
  regPwdUrl:string,
  createdBy: string,
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const atnList: ActionType[] = await Modules.find({isActive: true})
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName')
      .sort({ createdAt: -1 });
      
        if (!atnList) {
            return NextResponse.json({ success: false, msg: "No actions found" }, { status: 404 });
        } else {
            return NextResponse.json({ atnList, success: true }, {status:200});
        }
    } catch (error) {
        return new NextResponse("Error while fetching actionsData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { atnName , listUrl,viewUrl, addUrl, editUrl, enableUrl, disableUrl, deleteUrl, markUrl, amendUrl, attdeesUrl, attdImgUrl, compUrl, apvEnrUrl, mnlEnrUrl, apvDocUrl, createdBy, regPwdUrl }: ActionType = await req.json();
  
      const newAction = new Modules({ atnName, listUrl, viewUrl, addUrl, editUrl, enableUrl, disableUrl, deleteUrl, markUrl, amendUrl, attdeesUrl, attdImgUrl, compUrl, apvEnrUrl, mnlEnrUrl, apvDocUrl, createdBy, regPwdUrl });
      const savedAction = await newAction.save();
  
      return NextResponse.json({ savedAction, success: true, msg:"Action created successfully." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving catData: " + error, {status: 500});
      }
    }
  }