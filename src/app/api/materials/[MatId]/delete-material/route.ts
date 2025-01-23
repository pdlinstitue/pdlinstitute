import { NextResponse, NextRequest } from "next/server";
import Materials from "../../../../../../modals/Materials";
import dbConnect from "../../../../../../dbConnect";

interface IMatParams {
    MatId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: IMatParams}):Promise<NextResponse> {

    try {
        await dbConnect();
        
        const delMat = await Materials.findByIdAndDelete(params.MatId);
        return NextResponse.json({delMat, success:true, msg: "Material deleted successfully." }, { status: 200 });
    
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
