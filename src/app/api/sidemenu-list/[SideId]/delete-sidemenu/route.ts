import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Sidemenues from "../../../../../../modals/Sidemenues";
import { verifyApiToken } from "@/app/utils/verifyApiToken";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ SideId: string }>}) {

    try {

        await verifyApiToken();
        await dbConnect();
        const { SideId } = await params;

        if (!SideId) {
            return NextResponse.json({success:false, msg: "No sidemenu found." }, { status: 400 });
        }else{
            const delSideMenu = await Sidemenues.findByIdAndDelete(SideId);
            return NextResponse.json({delSideMenu, success:true, msg: "Sidemenu deleted successfully." }, { status: 200 });
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
