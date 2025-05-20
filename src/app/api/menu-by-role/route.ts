import { NextRequest, NextResponse } from "next/server";
import Menuaccess from "../../../../modals/Menuaccess";
import dbConnect from "../../../../dbConnect";
import Roles from "../../../../modals/Roles";

export async function GET(
  req: NextRequest) {
  try {
    await dbConnect();

    const userRoleName = req.nextUrl.searchParams.get("userRole");
    const userRole=await Roles.findOne({
      roleType: userRoleName,
    });
    const menuAccess = await Menuaccess.find({
      roleId: userRole?._id,
      isActive: true,
    }).populate(
      "menuId",
      "menuName menuIcon menuUrl menuOrder isParent isChild parentId"
    );

    if (menuAccess) {
      return NextResponse.json(
        { menuByRole: menuAccess, success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, msg: "No menu found." },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        msg: `Error while fetching menu data: ${error.message}`,
      },
      { status: 500 }
    );
  }
}