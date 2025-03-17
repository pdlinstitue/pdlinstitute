import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";


type SdkType = {
  isActive:boolean;
  disabledBy:string;
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ SdkId: string }> }) {

    try 
    {
      await dbConnect();
      const { SdkId } = await params;
      const {disabledBy} : SdkType = await req.json();

      if(!SdkId){
        return NextResponse.json({success:false, msg: "No Sadhak found." }, { status: 404 });
      } else {
        const sdkById = await Users.findByIdAndUpdate(SdkId, {isActive:false, disabledBy}, {runValidators:false});
        return NextResponse.json({ sdkById, success: true, msg:"Sadhak disabled successfully." }, {status:200});
      }        
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while disabling SadhakData: " + error, {status: 400});
      }
    }
  }