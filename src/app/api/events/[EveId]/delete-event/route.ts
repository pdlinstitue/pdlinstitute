import { NextResponse, NextRequest } from "next/server";
import Events from "../../../../../../modals/Events";
import dbConnect from "../../../../../../dbConnect";

interface IEveParams {
    EveId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: IEveParams}):Promise<NextResponse> {

    try {
        await dbConnect();      
        const delEve = await Events.findByIdAndDelete(params.EveId);
        return NextResponse.json({delEve, success:true, msg: "Event deleted successfully." }, { status: 200 });
        
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
