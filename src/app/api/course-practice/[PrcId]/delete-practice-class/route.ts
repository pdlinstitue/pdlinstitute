import { NextResponse, NextRequest } from "next/server";
import Practices from "../../../../../../modals/Practices";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ PrcId: string}> }){

    try {
        await dbConnect();   
        const { PrcId } = await params;
        if(!PrcId){
            return NextResponse.json({ success: false, msg: "No Practice Class Found." }, { status: 404 });
        }  else {
            const prcById = await Practices.findByIdAndDelete(PrcId);
            return NextResponse.json({ prcById, success: true, msg: "Practice class deleted successfully." }, { status: 200 });
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
