import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
 
type SdkType = {
  isActive:boolean,
  updatedBy:string,
} 

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ SdkId: string}> }) {

  try 
    {
      await dbConnect();
      const { SdkId } = await params;
      const { updatedBy} : SdkType = await req.json();

      if (!SdkId){
          return NextResponse.json({ success: false, msg: "No Sadhak found with the given id." }, { status: 404 });
      } else {
        const sdkById = await Users.findByIdAndUpdate(SdkId, {isActive:true, updatedBy}, {new: true, runValidators: true});
        return NextResponse.json({ sdkById, success: true, msg:"Sadhak enabled successfully." }, {status:200});   
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