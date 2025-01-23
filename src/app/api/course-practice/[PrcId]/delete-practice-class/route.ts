import { NextResponse, NextRequest } from "next/server";
import Practices from "../../../../../../modals/Practices";
import dbConnect from "../../../../../../dbConnect";

interface IPrcParams {
    PrcId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: IPrcParams}):Promise<NextResponse> {

    try {
        await dbConnect();      
        const delPrcClass = await Practices.findByIdAndDelete(params.PrcId);
        return NextResponse.json({delPrcClass, success:true, msg: "Practice class deleted successfully." }, { status: 200 });
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
