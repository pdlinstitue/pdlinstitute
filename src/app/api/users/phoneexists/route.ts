import { NextRequest, NextResponse } from "next/server";
import Users from "../../../../../modals/Users";

export async function GET(req: NextRequest) {
    const sdkPhone = req.nextUrl.searchParams.get("sdkPhone");

    try {
        const existingPhone = await Users.findOne({ sdkPhone });

        if (existingPhone) {
            return NextResponse.json(
                { success: true, data: existingPhone, msg: "Phone already exists", isPhoneValid: false },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, msg: `User not found by phone ${sdkPhone}`, isPhoneValid: true },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, msg: `Error while fetching user by phone ${sdkPhone}: ${error}`, isPhoneValid: false },
            { status: 500 }
        );
    }
}