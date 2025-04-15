import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import States from "../../../../modals/States";

type SttType = {
    _id: string;
    state_id: number;
    state_name: string;
    country_id: number;
    country_iso2: string;
    state_iso2: string;
};

export async function GET(req: NextRequest) {

    try {

        await dbConnect(); 
        const country_name = req.nextUrl.searchParams.get("country_name");

        if (!country_name) {
            return NextResponse.json({ success: false, msg: "country is required" }, { status: 400 });
        }

        const stateList: SttType[] = await States.find({ country_name });

        if (stateList.length > 0) {
            return NextResponse.json({ sttList: stateList, success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, msg: "No state list found" }, { status: 404 });
        }
    } catch (error) {
        return new NextResponse("Error while fetching state data: " + error, { status: 500 });
    }
}