import { NextRequest, NextResponse } from "next/server";
import Users from "../../../../../modals/Users";

export async function GET(req: NextRequest) {
    const sdkEmail = req.nextUrl.searchParams.get("sdkEmail");

    try {
        const existingEmail = await Users.findOne({ sdkEmail });

        if (existingEmail) {
            return NextResponse.json(
                { success: true, msg: "Email already exists", isEmailValid:false },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, msg: `User not found by email ${sdkEmail}`, isEmailValid:true},
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, msg: `Error while fetching user by email ${sdkEmail}: ${error}`, isEmailValid:false },
            { status: 500 }
        );
    }
}