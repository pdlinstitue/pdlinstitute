import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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