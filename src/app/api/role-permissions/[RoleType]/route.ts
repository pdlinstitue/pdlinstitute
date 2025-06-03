import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../dbConnect";
import Permissions from "../../../../../modals/Permissions";
import Roles from "../../../../../modals/Roles";
import Modules from "../../../../../modals/Modules";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ RoleType: string }> }
) {
  await dbConnect();
  const { RoleType } = await params;

  try {
    const role = await Roles.find({ roleType: RoleType, isActive: true });

    const permissions = await Permissions.find({
      rolId: role[0]._id,
      isActive: true,
      isDeleted: false,
    });

    const allowedUrls: string[] = [];

    const modules = await Modules.find();

    permissions.forEach((perm: any) => {
      modules.forEach((mod: any) => {
        mod.modActions?.forEach((action: any) => {
          if (perm.modAtnIds.includes(action._id)) {
            allowedUrls.push(action.url);
          }
        });
      });
    });

    return NextResponse.json({ allowedUrls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}