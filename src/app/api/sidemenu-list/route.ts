import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Sidemenues from "../../../../modals/Sidemenues";
import mongoose from "mongoose";
import { verifyApiToken } from "@/app/utils/verifyApiToken";

type SideMenuType = {
  _id?: string;
  menuName: string;
  menuIcon: string;
  menuUrl: string;
  menuOrder: number;
  isActive?: boolean;
  isParent?: boolean;
  isChild?: boolean;
  parentId?: string;
  parentName?: string;
  createdBy?: string;
};

export async function GET(req: NextRequest) {
  try {

    await verifyApiToken();
    await dbConnect();
    const menuList = await Sidemenues.find({ isActive: true })
      .populate("createdBy", "sdkFstName")
      .populate("updatedBy", "sdkFstName")
      .sort({ createdAt: -1 })
      .lean();

    if (!menuList || menuList.length === 0) {
      return NextResponse.json(
        { success: false, msg: "No menu found" },
        { status: 404 }
      );
    }

    const idToNameMap = new Map<string, string>();
    menuList.forEach((item: any) => {
      idToNameMap.set(item._id.toString(), item.menuName);
    });

    menuList.forEach((item: any) => {
      if (item.parentId) {
        const parentIdStr = item.parentId.toString();
        item.parentName = idToNameMap.get(parentIdStr) || "";
      } else {
        item.parentName = "";
      }
    });

    return NextResponse.json({ menuList, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu list:", error);
    return new NextResponse("Error while fetching menu list: " + error, {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {

    await verifyApiToken();
    await dbConnect();

    const {
      menuName,
      menuIcon,
      menuUrl,
      menuOrder,
      isChild,
      isParent,
      parentId,
      createdBy,
    }: SideMenuType = await req.json();

    const nameExists = await Sidemenues.findOne({
      menuName: { $regex: `^${menuName}$`, $options: "i" },
    });

    if (nameExists) {
      return NextResponse.json(
        { success: false, msg: "Menu name already exists." },
        { status: 400 }
      );
    }

    if (menuIcon) {
      const iconExists = await Sidemenues.findOne({
        menuIcon: { $regex: `^${menuIcon}$`, $options: "i" },
      });

      if (iconExists) {
        return NextResponse.json(
          { success: false, msg: "Menu icon already exists." },
          { status: 400 }
        );
      }
    }

    const urlExists = await Sidemenues.findOne({
      menuUrl: { $regex: `^${menuUrl}$`, $options: "i" },
    });

    if (urlExists) {
      return NextResponse.json(
        { success: false, msg: "Menu URL already exists." },
        { status: 400 }
      );
    }

    const newMenu = new Sidemenues({
      menuName,
      menuIcon,
      menuUrl,
      menuOrder,
      isChild,
      isParent,
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
      createdBy,
    });
    const savedMenu = await newMenu.save();

    return NextResponse.json(
      { savedMenu, success: true, msg: "Menu created successfully." },
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
      return new NextResponse("Error while saving enrData: " + error, {
        status: 400,
      });
    }
  }
}