import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Screenshots from "../../../../modals/Screenshots";


type ScreenshotsType = {
    _id?: string;
    bthId: string;
    clsId: string;
    uploadedBy:string;
    attdSreenShots: string[];
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const bthId =  request.nextUrl.searchParams.get("bthId");
        const clsId =  request.nextUrl.searchParams.get("clsId");

        const srnshots : ScreenshotsType[] = await Screenshots.find({bthId:bthId,clsId:clsId})
        .populate("createdBy", "sdkFstName")
        .populate("updatedBy", "sdkFstName")        
        .sort({ createdAt: -1 });

        if (!srnshots) {
            return NextResponse.json({succes:false, msg: "No screenshots found" }, { status: 404 });
        } else {
            return NextResponse.json({sucess:true, srnshots}, { status: 200 });
        }     
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch screenshots" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {

        await dbConnect();
        const { bthId, clsId, attdSreenShots, uploadedBy } : ScreenshotsType = await request.json();

        const filter = { bthId, clsId, uploadedBy };
        const update = { $set: { attdSreenShots } };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const savedSrnShots = await Screenshots.findOneAndUpdate(filter, update, options);

        return NextResponse.json({ success: true, savedSrnShots, msg: "Screenshots uploaded successfully" }, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ error: "Failed to save screenshots" }, { status: 500 });
    }
}