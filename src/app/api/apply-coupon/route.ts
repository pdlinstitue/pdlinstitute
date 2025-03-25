import { NextRequest, NextResponse } from "next/server";
import Coupons from "../../../../modals/Coupons";
import Enrollments from "../../../../modals/Enrollments";
import moment from "moment";

type CouponType = {
    cpnName: string;
    appliedBy: string;
    corId: string;
}


export  async function POST (req:NextRequest) {

    try {

        const { cpnName, appliedBy, corId } : CouponType = await req.json();
        const coupon = await Coupons.findOne({ cpnName });

        if (!coupon) {
            return NextResponse.json({success:false, msg: 'No coupon exists' }, { status: 404 });
        }

        if (coupon.cpnCourse !== corId) {
            return NextResponse.json({success:false, msg: 'Coupon is not valid for this course' }, { status: 403 });
        }

        if (coupon.cpnFor === 'Specific') {
            // Ensure user is allotted this coupon
            if (!coupon.cpnSdk.includes(appliedBy)) {
                return NextResponse.json({success:false, msg: 'User not allowed to use this coupon' }, { status: 403 });
            }
        }
        
        const expiryDate = moment(coupon.createdAt).add(coupon.cpnVal, 'months');

        if (moment().isAfter(expiryDate, 'month')) {
            return NextResponse.json({success:false, msg: 'Coupon has expired' }, { status: 400 });
        }

        // Check coupon usage limit by the same user
        const userCouponUsage = await Enrollments.countDocuments({ cpnName, appliedBy });

        if (userCouponUsage >= coupon.cpnUse) {
            return NextResponse.json({success:false, msg: 'Coupon usage limit exceeded' }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            msg: 'Coupon applied successfully',
            cpnDisType: coupon.cpnDisType, 
            cpnDisc: coupon.cpnDisc 
        }, { status: 200 });
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map((val:any) => val.message);
          return NextResponse.json({ success: false, msg: messages }, {status:400});
        }else{
          return new NextResponse ("Error while saving data: " + error, {status: 400});
        }
    }
};