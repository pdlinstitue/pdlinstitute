import Roles from "../../../../modals/Roles";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type RolType = {
    _id?: string;
    roleType:string;
    createdBy?:string;
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const rolList: RolType[] = await Roles.find({isActive: true})
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName');
      
      return NextResponse.json({ rolList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching roleData: " + error, {status:500});
    }
  }
  
  export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { roleType, createdBy }: RolType = await req.json();
  
      const newRole = new Roles({ roleType, createdBy });
      const savedRole = await newRole.save();
  
      return NextResponse.json({ savedRole, success: true, msg:"Role created successfully!" }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving catData: " + error, {status: 500});
      }
    }
  }