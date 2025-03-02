import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Cities from "../../../../modals/Cities";

type CityType = {
    _id: string;
    city_id: number;
    city_name: string;
    state_id: number;
};

export async function GET(req: NextRequest) {

    try {
        
        await dbConnect(); 
        const state_id = req.nextUrl.searchParams.get("state_id");

        if (!state_id) {
            return NextResponse.json({ success: false, msg: "state_id is required" }, { status: 400 });
        }

        const cityList: CityType[] = await Cities.find({ state_id });

        if (cityList.length > 0) {
            return NextResponse.json({ cityList: cityList, success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, msg: "No city list found" }, { status: 404 });
        }
    } catch (error) {
        return new NextResponse("Error while fetching state data: " + error, { status: 500 });
    }
}