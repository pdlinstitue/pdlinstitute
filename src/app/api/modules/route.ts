import Modules from "../../../../modals/Modules";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type ModulesData = {
  modName: string;
  modActions: { name: string; url: string }[];
  createdBy: string;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const modules = await Modules.find({ isActive: true })
      .populate("createdBy", "sdkFstName")
      .populate("updatedBy", "sdkFstName")
      .sort({ createdAt: -1 });

    if (!modules) {
      return NextResponse.json(
        { success: false, msg: "No modules found" },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ modules, success: true }, { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Error while fetching module data: " + error, {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { modName, modActions, createdBy }: ModulesData = await req.json();

    const newModule = new Modules({ modName, modActions, createdBy });
    const savedModule = await newModule.save();

    return NextResponse.json(
      { savedModule, success: true, msg: "Module created successfully." },
      { status: 200 }
    );
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