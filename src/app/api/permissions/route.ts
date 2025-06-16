import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Permissions from "../../../../modals/Permissions";
import { verifyApiToken } from "@/app/utils/verifyApiToken";

type PermitType = {
  rolId: string;
  modId: string;
  modAtnIds: string[];
  createdBy: string;
  updatedBy: string;
};

export async function GET(req: NextRequest) {
  try {

    await verifyApiToken();
    const { searchParams } = new URL(req.url);    
    const rolId = searchParams.get("rolId");
    const modId = searchParams.get("modId");

    await dbConnect();
    const pmtList: PermitType[] = await Permissions.find({      
      rolId,
      modId,
      isActive: true,
    })      

    if (!pmtList) {
      return NextResponse.json(
        { success: false, msg: "No permission found" },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ pmtList, success: true }, { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Error while fetching actionsData: " + error, {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {

    await verifyApiToken();
    await dbConnect();

    const {      
      rolId,
      modId,
      modAtnIds,
      createdBy,
      updatedBy,
    }: PermitType = await req.json();

    const updateFields = {      
      rolId,
      modId,
      modAtnIds,
      createdBy,
      updatedBy,
      updatedAt: new Date(),
    };

    const updatedPermission = await Permissions.findOneAndUpdate(
      { rolId, modId, isActive: true },
      { $set: updateFields },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        savedPermission: updatedPermission,
        success: true,
        msg: "Permission saved successfully.",
      },
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
      return new NextResponse("Error while saving permission: " + error, {
        status: 500,
      });
    }
  }
}