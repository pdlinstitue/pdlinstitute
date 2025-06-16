import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Sidemenues from "../../../../../../modals/Sidemenues";
import { verifyApiToken } from "@/app/utils/verifyApiToken";

type SideMenuType = {
  menuName: string;
  menuIcon: string;
  menuUrl: string;
  menuOrder: number;
  isParent?: boolean;
  isChild?: boolean;
  parentId?: string;
  updatedBy?: string;
};

export async function PUT(req: NextRequest, { params }: { params: Promise<{ SideId: string }> }) {
  try {

    await verifyApiToken();
    await dbConnect();

    const { SideId } = await params;
    const { menuName, menuIcon, menuUrl, menuOrder, isChild, isParent, parentId, updatedBy }: SideMenuType = await req.json();

    if (!SideId) {
      return NextResponse.json({ success: false, msg: "No sidemenu found." }, { status: 404 });
    }

    const existingMenu = await Sidemenues.findById(SideId);
    
    if (!existingMenu) {
      return NextResponse.json({ success: false, msg: "Menu not found." }, { status: 404 });
    }

    // Check if menuName is updated and already exists (case-insensitive)
    if (menuName && menuName.toLowerCase() !== existingMenu.menuName.toLowerCase()) {
      const nameExists = await Sidemenues.findOne({
        _id: { $ne: SideId },
        menuName: { $regex: `^${menuName}$`, $options: "i" },
      });

      if (nameExists) {
        return NextResponse.json(
          { success: false, msg: "Menu name already exists." },
          { status: 400 }
        );
      }
    }

    // Check if menuIcon is updated and already exists
    if (menuIcon && menuIcon.toLowerCase() !== existingMenu.menuIcon.toLowerCase()) {
      const iconExists = await Sidemenues.findOne({
        _id: { $ne: SideId },
        menuIcon: { $regex: `^${menuIcon}$`, $options: "i" },
      });

      if (iconExists) {
        return NextResponse.json(
          { success: false, msg: "Menu icon already exists." },
          { status: 400 }
        );
      }
    }

    // Check if menuUrl is updated and already exists
    if (menuUrl && menuUrl.toLowerCase() !== existingMenu.menuUrl.toLowerCase()) {
      const urlExists = await Sidemenues.findOne({
        _id: { $ne: SideId },
        menuUrl: { $regex: `^${menuUrl}$`, $options: "i" },
      });

      if (urlExists) {
        return NextResponse.json(
          { success: false, msg: "Menu URL already exists." },
          { status: 400 }
        );
      }
    }

    // Perform the update
    existingMenu.menuName = menuName;
    existingMenu.menuIcon = menuIcon;
    existingMenu.menuUrl = menuUrl;
    existingMenu.menuOrder = menuOrder;
    existingMenu.isChild = isChild;
    existingMenu.isParent = isParent;
    existingMenu.parentId = parentId ? new mongoose.Types.ObjectId(parentId) : null;
    existingMenu.updatedBy = updatedBy;

    const updatedMenu = await existingMenu.save();

    return NextResponse.json(
      { success: true, updatedMenu, msg: "Menu updated successfully." },
      { status: 200 }
    );
    
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving enrData: " + error, {status: 400});
    }
  }
}