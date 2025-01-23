import { NextResponse, NextRequest } from "next/server";
import Documents from "../../../../../../modals/Documents";
import dbConnect from "../../../../../../dbConnect";

interface IDocParams {
    DocId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: IDocParams}):Promise<NextResponse> {

    try {
        await dbConnect();      
        const delDoc = await Documents.findByIdAndDelete(params.DocId);

        if (!delDoc) {
            return NextResponse.json({ success: false, msg: "Document not found." }, { status: 404 });
        } else {
            return NextResponse.json({delDoc, success:true, msg: "Document deleted successfully." }, { status: 200 });
        }
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
