import { NextRequest, NextResponse } from "next/server";
import Coupons from "../../../../modals/Coupons";
import dbConnect from "../../../../dbConnect";
import Users from "../../../../modals/Users";


export async function GET(req: NextRequest) {
    
    try {
        await dbConnect();
        const sdkId = req.nextUrl.searchParams.get("sdkId");

        if (!sdkId) {
            return new NextResponse(JSON.stringify({ success: false, msg: "No Sadhak Found" }), { status: 404 });
        }

        // Convert sdkId to an array if multiple IDs are comma-separated
        //const sdkIdArray = sdkId.split(",");

        // Fetch all active coupons available for everyone
        const cpnListForAll = await Coupons.find({ isActive: true, cpnFor: "All" })
        .populate("cpnCourse", "coNick")
        .sort({createdAt:-1})
        .lean();

        const user=await Users.find({_id:sdkId});

        // Fetch active coupons that are specific and match the user's sdkId
        const cpnListForSpecific = await Coupons.find({ 
            isActive: true, 
            cpnFor: "Specific", 
            cpnSdk: { $in: user[0].sdkRegNo } // Check if sdkId exists in the cpnSdk array
        })
        .populate("cpnCourse", "coNick")
        .sort({createdAt:-1})
        .lean();

        // Merge both coupon lists
        const finalCpnList = [...cpnListForAll, ...cpnListForSpecific];

        if (finalCpnList.length > 0) {
            return NextResponse.json({ success: true, cpnList: finalCpnList }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, msg: "No coupons found" }, { status: 404 });
        }
    } catch (error: any) {
        return new NextResponse("Error while fetching coupons: " + error, { status: 400 });
    }
}
