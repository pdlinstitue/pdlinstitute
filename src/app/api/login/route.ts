import Users from "../../../../modals/Users";
import dbConnect from "../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (request: NextRequest) => {
  try {
    const { sdkCred, sdkPwd } = await request.json();
    await dbConnect();

    if (!sdkCred || !sdkPwd) {
      return NextResponse.json({ success: false, token: '', msg: 'Missing credentials!' }, { status: 400 });
    }

    const user = await Users.findOne({ $or: [{ sdkPhone: sdkCred }, { sdkEmail: sdkCred }] });
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
        isPasswordValid=true;
      }
    }

    if(!isPasswordValid){
      return NextResponse.json({ success: false, token: '', msg: 'Invalid password!' }, { status: 400 });
    }

    //Redirect Sadhak users to the service unavailable page
    // if (user.sdkRole === 'Sadhak') {
    //   return NextResponse.json({
    //     success: false,
    //     redirect: true,
    //     location: '/service-unavailable',
    //     msg: 'Redirecting...',
    //   }, { status: 200 });
    // }    

    const secretKey = crypto.randomBytes(32).toString('hex');
    const expiresIn = process.env.LOGIN_EXPIRES ? parseInt(process.env.LOGIN_EXPIRES) : 600;
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn });
    user.sdkPwd = null;

    const res = NextResponse.json({
      result: { id: user._id, usrName: user.sdkFstName, usrRole: user.sdkRole, usrToken: token, success: true }
    }, { status: 200 });
    
    return res;
  } catch (error:any) {
    const errorMessage = error.name === 'ValidationError' ? Object.values(error.errors).map((val:any) => val.message) : "Error while processing request.";
    return NextResponse.json({ success: false, msg: errorMessage }, { status: 400 });
  }
};