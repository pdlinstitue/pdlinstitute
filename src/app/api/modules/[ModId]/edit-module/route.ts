import { NextResponse, NextRequest } from "next/server";
import Modules from "../../../../../../modals/Modules";
import dbConnect from "../../../../../../dbConnect";
import { verifyApiToken } from "@/app/utils/verifyApiToken";

type ModulesData = {
  modName: string;
  modActions: { name: string; url: string }[];
  updatedBy: string;
};

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ ModId: string }> }) {

  try {

    await verifyApiToken(); 
    await dbConnect();
    const { ModId } = await params;
    const { modName, modActions, updatedBy }: ModulesData = await req.json();

    if (!ModId) {
      return NextResponse.json(
        { success: false, msg: "No module found." },
        { status: 404 }
      );
    } else {
      const modById = await Modules.findByIdAndUpdate(
        ModId,
        { modName, modActions, updatedBy },
        { runValidators: true }
      );
      return NextResponse.json(
        { modById, success: true, msg: "Module updated successfully." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return NextResponse.json(
        { success: false, msg: messages },
        { status: 400 }
      );
    } else {
      return new NextResponse("Error while saving module data: " + error, {
        status: 500,
      });
    }
  }
}