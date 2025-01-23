import { NextResponse, NextRequest } from "next/server";
import Practices from "../../../../../../modals/Practices";
import dbConnect from "../../../../../../dbConnect";


interface IPrcParams{
    PrcId: string;
}

export async function PATCH(req: NextRequest, {params}:{params:IPrcParams}) {

    try 
    {
      await dbConnect();
      const prcById = await Practices.findByIdAndUpdate(params.PrcId, {isActive:false}, {runValidators:false});

      if (!prcById) { 
        return new NextResponse("Pfractice class not found", { status: 404 }); 
      } else {
        return NextResponse.json({ prcById, success: true, msg: "Practice class disabled successfully." }, { status: 200 });
      } 
      
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving practiceData: " + error, {status: 400});
      }
    }
  }