import { NextResponse, NextRequest } from "next/server";
import Classes from "../../../../../../../modals/Classes";
import dbConnect from "../../../../../../../dbConnect";

interface IClsParams {
    ClsId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: IClsParams}):Promise<NextResponse> {

    try {
        await dbConnect();
        const delClass = await Classes.findByIdAndDelete(params.ClsId);
        return NextResponse.json({delClass, success:true, msg: "Class deleted successfully." }, { status: 200 });
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
