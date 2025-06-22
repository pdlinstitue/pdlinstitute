import { NextResponse, NextRequest } from "next/server";
import Roles from "../../../../../../modals/Roles";
import dbConnect from "../../../../../../dbConnect";
 
type RolType = {
  isActive:boolean;
  disabledBy:string;
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ RolId: string }>}) {

    try 
    {
      await dbConnect();
      const { RolId } = await params;
      const { disabledBy }: RolType = await req.json();
      
      const rolById = await Roles.findByIdAndUpdate(RolId, {isActive:false, disabledBy}, {runValidators:false});
      return NextResponse.json({ rolById, success: true, msg:"Role disabled successfully!" }, {status:200});  

    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while disabling category: " + error, {status: 500});
      }
    }
  }