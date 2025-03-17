import { NextResponse, NextRequest } from "next/server";
import Practices from "../../../../../../modals/Practices";
import dbConnect from "../../../../../../dbConnect";


type PrcType = {
  isActive:boolean,
  disabledBy?:string
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ PrcId: string}> }) {

 try 
  {
    await dbConnect();
    const { PrcId } = await params;
    const { disabledBy }: PrcType = await req.json();

    if (!PrcId) { 
      return new NextResponse("No Practice Class Found", { status: 404 }); 
    } else {
      const prcById = await Practices.findByIdAndUpdate(PrcId, {isActive:false, disabledBy}, {runValidators:false});
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