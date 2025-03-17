import { NextResponse, NextRequest } from "next/server";
import Classes from "../../../../../../../modals/Classes";
import dbConnect from "../../../../../../../dbConnect";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ ClsId: string, DayId: string }> }) {

    try {
        await dbConnect();
        const {ClsId, DayId} = await params;

        const delClass = await Classes.findOneAndUpdate(
            { _id: ClsId }, 
            { 
                $pull: { clsName: { _id: DayId } }  // Remove only the matching clsName entry
            },
            { new: true } // Return the updated document
        );

        if (!delClass) {
            return NextResponse.json({ success: false, msg: "Class not found." }, { status: 404 });
        } else {
            return NextResponse.json({ delClass, success: true, msg: "Class entry deleted successfully." }, { status: 200 });
        }

    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 500 });
        }
    }
}