import { NextResponse, NextRequest } from "next/server";
import Coupons from "../../../../../../modals/Coupons";
import dbConnect from "../../../../../../dbConnect";

interface ICpnParams {
    CpnId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: ICpnParams}):Promise<NextResponse> {

    try {
        await dbConnect();      
        const delEve = await Coupons.findByIdAndDelete(params.CpnId);
        return NextResponse.json({delEve, success:true, msg: "Coupon deleted successfully." }, { status: 200 });
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting couponData: " + error, { status: 400 });
        }
    }
}
