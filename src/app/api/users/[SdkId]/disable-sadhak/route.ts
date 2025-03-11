import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
 
interface ISdkParams{
    SdkId?: string;
}

type SdkType = {
  disabledBy:string;
}

export async function PATCH(req: NextRequest, {params}:{params:ISdkParams}) {

    try 
    {
      await dbConnect();

      const {disabledBy} : SdkType = await req.json();
      const sdkById = await Users.findByIdAndUpdate(params.SdkId, {isActive:false, disabledBy}, {runValidators:false});
      return NextResponse.json({ sdkById, success: true, msg:"Sadhak disabled successfully." }, {status:200});   
      
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while disabling SadhakData: " + error, {status: 400});
      }
    }
  }