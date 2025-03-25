import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Countries from "../../../../modals/Countries";

type CtrType = {
    _id:string,
    country_name:string
    country_iso2:string
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const ctrList: CtrType[] = await Countries.find();
        return NextResponse.json({ ctrList, success: true }, { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching ctrData: " + error, { status: 500 });
    }
}
