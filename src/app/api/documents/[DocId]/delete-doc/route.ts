import { NextResponse, NextRequest } from "next/server";
import Documents from "../../../../../../modals/Documents";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ DocId: string}> }) {

    try {
        await dbConnect();   
        const { DocId } = await params; 
        
        if (!DocId) {
            return NextResponse.json({ success: false, msg: "No Document Found." }, { status: 404 });
        } else {
            const delDoc = await Documents.findByIdAndDelete(DocId);
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
