import { NextResponse, NextRequest } from "next/server";
import Documents from "../../../../../../modals/Documents";
import dbConnect from "../../../../../../dbConnect";

type DocType = {
  isActive:boolean,
  disabledBy:string
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ DocId: string}> }) {

    try 
    {
      await dbConnect();
      const { DocId } = await params;
      const {disabledBy} : DocType = await req.json();

      if (!DocId) { 
        return  NextResponse.json({success:false, msg:"No Document Found"}, { status: 404 }); 
      } else {
        const docById = await Documents.findByIdAndUpdate(DocId, {isActive:false, disabledBy});
        return NextResponse.json({ docById, success: true, msg: "Document disabled successfully." }, { status: 200 });
      }      
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving data: " + error, {status: 400});
      }
    }
  }