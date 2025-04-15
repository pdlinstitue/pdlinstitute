import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Roles from "../../../../../../modals/Roles";

type RolType = {
  _id?: string;
  roleType:string;
  updatedBy?:string;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ RolId: string }> }) {

  try {
    await dbConnect();
    const { RolId } = await params;
    const { roleType, updatedBy }: RolType = await req.json();

    if (!RolId) {
      return NextResponse.json({sucess:false, msg: "No role found." }, { status: 404 });
    }

    const normalizedRoleType = roleType.trim().toLowerCase();

    if (normalizedRoleType === "admin") {
      return NextResponse.json(
        { success: false, msg: "You are unauthorized to create Admin role" },
        { status: 403 }
      );
    }

    // Fetch the existing role
    const existingRole = await Roles.findById(RolId);
    if (!existingRole) {
      return NextResponse.json({success:false, msg: "Role not found." }, { status: 404 });
    }

    // Only check for duplicates if roleType is changing
    if (existingRole.roleType.toLowerCase() !== normalizedRoleType) {
      const isRoleTypeExists = await Roles.findOne({
        roleType: { $regex: new RegExp(`^${normalizedRoleType}$`, 'i') },
      });

      if (isRoleTypeExists) {
        return NextResponse.json(
          { success: false, msg: "Role already exists!" },
          { status: 400 }
        );
      }
    }

    const rolById = await Roles.findByIdAndUpdate(
      RolId,
      { roleType, updatedBy },
      { runValidators: true, new: true }
    );

    return NextResponse.json(
      { rolById, success: true, msg: "Role updated successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    } else {
      return new NextResponse("Error while saving rolData: " + error, { status: 500 });
    }
  }
}


