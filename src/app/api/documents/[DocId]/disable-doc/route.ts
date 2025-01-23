import { NextResponse, NextRequest } from "next/server";
import Documents from "../../../../../../modals/Documents";
import dbConnect from "../../../../../../dbConnect";


interface IDocParams{
    DocId: string;
}

export async function PATCH(req: NextRequest, {params}:{params:IDocParams}) {

    try 
    {
      await dbConnect();
      const docById = await Documents.findByIdAndUpdate(params.DocId, {isActive:false});

      if (!docById) { 
        return new NextResponse("Document not found", { status: 404 }); 
      } else {
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