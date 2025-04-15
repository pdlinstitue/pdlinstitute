import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Permissions from "../../../../modals/Permissions";

type PermitType = {
    atnId:string,
    rolId:string,
    isListEnabled:boolean,
    isViewEnabled:boolean,
    isAddEnabled:boolean,
    isEditEnabled:boolean,
    isRegPwdEnabled:boolean,
    isEnbEnabled:boolean,
    isDisEnabled:boolean,
    isDelEnabled:boolean,
    isMarkEnabled:boolean,
    isAttdeesEnabled:boolean,
    isAttdImgEnabled:boolean,
    isAmendEnabled:boolean,
    isApvEnrEnabled:boolean,
    isMnlEnrEnabled:boolean,
    isCompEnabled:boolean,
    createdBy: string
}

export async function GET(req:NextRequest){

    try {
  
const { searchParams } = new URL(req.url);
const atnId = searchParams.get('atnId');
const rolId = searchParams.get('rolId');

      await dbConnect();
      const pmtList: PermitType[] = await Permissions.find({isActive: true, atnId, rolId})
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName')
      
        if (!pmtList) {
            return NextResponse.json({ success: false, msg: "No permission found" }, { status: 404 });
        } else {
            return NextResponse.json({ pmtList, success: true }, {status:200});
        }
    } catch (error) {
        return new NextResponse("Error while fetching actionsData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { atnId, rolId, isListEnabled, isViewEnabled, isAddEnabled, isEditEnabled, isRegPwdEnabled, isEnbEnabled, isDisEnabled, isDelEnabled, isMarkEnabled, isAttdeesEnabled, isAttdImgEnabled, isAmendEnabled, isApvEnrEnabled, isMnlEnrEnabled, isCompEnabled, createdBy }: PermitType = await req.json();
  
      const newPermission = new Permissions({ atnId, rolId, isListEnabled, isViewEnabled, isAddEnabled, isEditEnabled, isRegPwdEnabled, isEnbEnabled, isDisEnabled, isDelEnabled, isMarkEnabled, isAttdeesEnabled, isAttdImgEnabled, isAmendEnabled, isApvEnrEnabled, isMnlEnrEnabled, isCompEnabled, createdBy });
      const savedPermission = await newPermission.save();
  
      return NextResponse.json({ savedPermission, success: true, msg:"Permission created successfully." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving catData: " + error, {status: 500});
      }
    }
  }