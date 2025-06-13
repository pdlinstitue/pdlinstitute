import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyApiToken } from "@/app/utils/auth";


export async function GET(req: NextRequest) {
  try {
    
    await verifyApiToken();
    await dbConnect();
    const activeSdkCount: number = await Users.countDocuments({ isActive: true });
    return NextResponse.json({ activeSdkCount, success: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Error while fetching sadhakData: " + error.message },
      { status: 500 }
    );
  }
}