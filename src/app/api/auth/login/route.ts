import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (request: NextRequest) => {

  try {
    const { sdkCred, sdkPwd } = await request.json();
    await dbConnect();

    if (!sdkCred || !sdkPwd) {
      return NextResponse.json({ success: false, token: '', msg: 'Missing credentials!' }, { status: 400 });
    }

    const user = await Users.findOne({
      $and: [
        { isActive: true },
        { $or: [{ sdkPhone: sdkCred }, { sdkEmail: sdkCred }] },
      ],
    });

    if (!user) {
      return NextResponse.json({ success: false, token: '', msg: 'Invalid user!' }, { status: 400 });
    }

    let isPasswordValid = await bcrypt.compare(sdkPwd, user.sdkPwd);
    const expiryDate = new Date(user.sdkRegPwdExpiry);
    const currentDate = new Date();

    if (!isPasswordValid) {
      if (currentDate > expiryDate) {
        return NextResponse.json({ success: false, token: '', msg: 'Password expired!' }, { status: 400 });
      }
      if (sdkPwd === user.sdkRegPwd) {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, token: '', msg: 'Invalid password!' }, { status: 400 });
    }

    const accessSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT_SECRET or JWT_REFRESH_SECRET not defined in environment');
    }

    const accessExpiresIn = process.env.LOGIN_EXPIRES
      ? parseInt(process.env.LOGIN_EXPIRES)
      : 900; // 15 minutes

    const refreshExpiresIn = 60 * 60 * 24; // 1 days

    const accessToken = jwt.sign({ id: user._id }, accessSecret, { expiresIn: accessExpiresIn });
    const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: refreshExpiresIn });

    user.sdkPwd = null;

    const res = NextResponse.json({
      result: {
        id: user._id,
        usrName: user.sdkFstName,
        usrRole: user.sdkRole,
        isAdmin: user.isAdmin,
        success: true,
      }
    }, { status: 200 });

    // Set HttpOnly cookies
    res.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: accessExpiresIn,
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: refreshExpiresIn,
    });

    return res;

  } catch (error: any) {
    const errorMessage = error.name === 'ValidationError'
      ? Object.values(error.errors).map((val: any) => val.message)
      : "Error while processing request.";
    return NextResponse.json({ success: false, msg: errorMessage }, { status: 400 });
  }
};
