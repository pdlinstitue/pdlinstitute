import { NextResponse, NextRequest } from "next/server";
import Materials from "../../../../../../modals/Materials";
import dbConnect from "../../../../../../dbConnect";
 
interface IMatParams{
    MatId?: string;
}

export async function PATCH(req: NextRequest, {params}:{params:IMatParams}) {

    try 
    {
      await dbConnect();
      const matById = await Materials.findByIdAndUpdate(params.MatId, {isActive:false}, {runValidators:false});
      return NextResponse.json({ matById, success: true, msg:"Material disabled successfully." }, {status:200});   
      
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while disabling matData: " + error, {status: 400});
      }
    }
  }