import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Classes from "../../../../../../modals/Classes";
import Assignments from "../../../../../../modals/Assignments";

interface IAsnParams {
    AsnId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: IAsnParams}):Promise<NextResponse> {

    try {
        await dbConnect();
        const isAssignmentUsed = await Classes.findOne({ clsName: params.AsnId });

        if (isAssignmentUsed) {
            return NextResponse.json({success:false, msg: "Assignment is being used. Can't be deleted." }, { status: 400 });
        }else{
            const delCat = await Assignments.findByIdAndDelete(params.AsnId);
            return NextResponse.json({delCat, success:true, msg: "Assignment deleted successfully." }, { status: 200 });
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
