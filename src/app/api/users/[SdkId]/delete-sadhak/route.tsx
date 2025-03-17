import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: NextRequest, {params}:{params: Promise<{SdkId: string}>}) {

    try {
        await dbConnect();  
        const {SdkId} = await params;    

        if(!SdkId){
            return NextResponse.json({success:false, msg: "No Sadhak found." }, { status: 404 });
        } else {
            const delSdk = await Users.findByIdAndDelete(SdkId);
        return NextResponse.json({delSdk, success:true, msg: "Sadhak deleted successfully." }, { status: 200 });
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
