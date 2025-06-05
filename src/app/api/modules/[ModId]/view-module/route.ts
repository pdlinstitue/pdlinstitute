import { NextResponse, NextRequest } from "next/server";
import Modules from "../../../../../../modals/Modules";
import dbConnect from "../../../../../../dbConnect";
import { verifyApiToken } from "@/app/utils/auth";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ ModId: string }> }) {

  try {

    await verifyApiToken(); 
    await dbConnect();
    const { ModId } = await params;
    const modById = await Modules.findById(ModId);

    if (!modById) {
      return NextResponse.json({ msg: "No module found." }, { status: 404 });
    } else {
      return NextResponse.json({ modById, success: true }, { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Error while fetching module data: " + error, {
      status: 500,
    });
  }
}