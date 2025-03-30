import { NextResponse, NextRequest } from "next/server";
import Enquiries from "../../../../../../modals/Enquiries";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ EqrId: string }>}) {

    try {
        await dbConnect();
        const { EqrId } = await params;

        if (EqrId) {
            return NextResponse.json({success:false, msg: "No enquiry found." }, { status: 400 });
        }else{
            const delEqr = await Enquiries.findByIdAndDelete(EqrId);
            return NextResponse.json({delEqr, success:true, msg: "Enquiry deleted successfully." }, { status: 200 });
        }
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting eqrData: " + error, { status: 400 });
        }
    }
}
