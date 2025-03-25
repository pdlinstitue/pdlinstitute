import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Roles from "../../../../../../modals/Roles";

type RolType = {
  _id?: string;
  roleType:string;
  updatedBy?:string;
}

export async function PUT(req: Request,{ params }: { params: Promise<{ RolId: string }>}) {

  try 
  {
    await dbConnect();
    const { RolId } = await params;
    const { roleType, updatedBy }: RolType = await req.json();

    if(!RolId){
      return NextResponse.json({ message: "No role found." }, { status: 404 });
    }else{
      const rolById = await Roles.findByIdAndUpdate(RolId, {roleType, updatedBy}, {runValidators:true});
      return NextResponse.json({ rolById, success: true, msg:"Role updated successfully!" }, {status:200});
    }
    
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving rolData: " + error, {status: 500});
    }
  }
}

