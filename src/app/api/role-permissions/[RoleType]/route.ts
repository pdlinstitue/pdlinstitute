import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../dbConnect";
import Permissions from "../../../../../modals/Permissions";
import { Types } from "mongoose";
import Roles from "../../../../../modals/Roles";

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
    }).populate("atnId");

    const allowedUrls: string[] = [];

    permissions.forEach((perm: any) => {
      const action = perm.atnId;
      if (!action || !action.isActive || action.isDeleted) return;

      if (perm.isListEnabled && action.listUrl)
        allowedUrls.push(action.listUrl);
      if (perm.isAddEnabled && action.addUrl) allowedUrls.push(action.addUrl);
      if (perm.isEditEnabled && action.editUrl)
        allowedUrls.push(action.editUrl);
      if (perm.isEnbEnabled && action.enableUrl)
        allowedUrls.push(action.enableUrl);
      if (perm.isDisEnabled && action.disableUrl)
        allowedUrls.push(action.disableUrl);
      if (perm.isDelEnabled && action.deleteUrl)
        allowedUrls.push(action.deleteUrl);
      if (perm.isMarkEnabled && action.markUrl)
        allowedUrls.push(action.markUrl);
      if (perm.isCompEnabled && action.compUrl)
        allowedUrls.push(action.compUrl);
      if (perm.isApvEnrEnabled && action.apvEnrUrl)
        allowedUrls.push(action.apvEnrUrl);
      if (perm.isMnlEnrEnabled && action.mnlEnrUrl)
        allowedUrls.push(action.mnlEnrUrl);
      if (perm.isAvpDocEnabled && action.avpDocUrl)
        allowedUrls.push(action.avpDocUrl);
    });

    return NextResponse.json({ allowedUrls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}