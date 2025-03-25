import { NextResponse, NextRequest } from "next/server";
import Roles from "../../../../../../modals/Roles";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ RolId: string }>}) {

    try {
        await dbConnect();
        const { RolId } = await params;
        
        const delRol = await Roles.findByIdAndDelete(RolId);
        return NextResponse.json({delRol, success:true, msg: "Role deleted successfully!" }, { status: 200 });
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
