import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/app/utils/token";
import { encrypt } from "@/app/utils/crypto";
import { cookies } from "next/headers";
import Roles from "../../../../../modals/Roles";
import Permissions from "../../../../../modals/Permissions";
import Modules from "../../../../../modals/Modules";
import { compressToEncodedURIComponent } from 'lz-string';

export const POST = async (request: NextRequest) => {
  try {
    const { sdkCred, sdkPwd } = await request.json();
    await dbConnect();

    if (!sdkCred || !sdkPwd) {
      return NextResponse.json(
        { success: false, token: "", msg: "Missing credentials!" },
        { status: 400 }
      );
    }

    const user = await Users.findOne({
      isActive: true,
      $or: [{ sdkPhone: sdkCred }, { sdkEmail: sdkCred }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, token: "", msg: "Invalid user!" },
        { status: 400 }
      );
    }

    let isPasswordValid = await bcrypt.compare(sdkPwd, user.sdkPwd);
    const expiryDate = user.sdkRegPwdExpiry
      ? new Date(user.sdkRegPwdExpiry)
      : null;
    const currentDate = new Date();

    if (!isPasswordValid && expiryDate && currentDate > expiryDate) {
      return NextResponse.json(
        { success: false, token: "", msg: "Password expired!" },
        { status: 400 }
      );
    }

    if (!isPasswordValid && sdkPwd === user.sdkRegPwd) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, token: "", msg: "Invalid password!" },
        { status: 400 }
      );
    }

    const payload = { id: user._id };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    const { _id, sdkFstName, sdkRole, isAdmin } = user;
    const loggedInUserInfo = {
      id: _id,
      usrName: sdkFstName,
      usrRole: sdkRole,
      isAdmin,
    };

    const cookieStore = await cookies();

    cookieStore.set("accessToken", await encrypt(accessToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refreshToken", await encrypt(refreshToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("loggedInUser", JSON.stringify(loggedInUserInfo), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    //allowed url role wise
    const role = await Roles.find({ roleType: sdkRole, isActive: true });
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
            allowedUrls.push(action.url.trim());
          }
        });
      });
    });

    cookieStore.set("allowedUrls", compressToEncodedURIComponent(JSON.stringify(allowedUrls)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // ✅ Return both login info + CSRF token
    return NextResponse.json(
      {
        result: { ...loggedInUserInfo, success: true },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login Error:", error);
    const errorMessage =
      error.name === "ValidationError"
        ? Object.values(error.errors)
            .map((val: any) => val.message)
            .join(", ")
        : "Error while processing request.";
    return NextResponse.json(
      { success: false, msg: errorMessage },
      { status: 400 }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  const { sdkRole } = await request.json();
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("loggedInUser")?.value;

  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie);
      // Update the user role or any other field as needed
      parsed.usrRole = sdkRole;

      cookieStore.set("loggedInUser", JSON.stringify(parsed), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      //allowed url role wise
      const role = await Roles.find({ roleType: sdkRole, isActive: true });
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
              allowedUrls.push(action.url.trim());
            }
          });
        });
      });

      cookieStore.set("allowedUrls", compressToEncodedURIComponent(JSON.stringify(allowedUrls)), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch (error) {
      console.error("Failed to parse or update cookie:", error);
      return NextResponse.json(
        { success: false, msg: "Failed to update user role." },
        { status: 400 }
      );
    }
  } else {
    console.warn("No cookie found to update");
    return NextResponse.json(
      { success: false, msg: "No user cookie found." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: true, msg: "User role updated successfully." },
    { status: 200 }
  );
};