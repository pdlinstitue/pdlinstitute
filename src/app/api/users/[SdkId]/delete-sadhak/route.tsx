import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";

interface ISdkParams {
    SdkId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: ISdkParams}):Promise<NextResponse> {

    try {
        await dbConnect();      
        const delSdk = await Users.findByIdAndDelete(params.SdkId);
        return NextResponse.json({delSdk, success:true, msg: "Sadhak deleted successfully." }, { status: 200 });
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
