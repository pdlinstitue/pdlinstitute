import { NextResponse, NextRequest } from "next/server";
import Coupons from "../../../../../../modals/Coupons";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ CpnId: string}> }){

    try {

        await dbConnect();      
        const { CpnId } = await params;

        if (!CpnId) {
            return new NextResponse("No Coupon Found", { status: 404 });
        } else {
            const delEve = await Coupons.findByIdAndDelete(CpnId);
            return NextResponse.json({delEve, success:true, msg: "Coupon deleted successfully." }, { status: 200 });
        }       
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting couponData: " + error, { status: 400 });
        }
    }
}
