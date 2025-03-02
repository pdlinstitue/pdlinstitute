import Users from "../../../../modals/Users";
import dbConnect from "../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const POST = async (request: NextRequest, response: NextResponse) => {

  try 
  {
      const { sdkCred, sdkPwd } = await request.json();
      await dbConnect();
      
      if(sdkCred && sdkPwd) {

        const user = await Users.findOne({ $or: [{ sdkPhone: sdkCred }, { sdkEmail: sdkCred }] });

        if (!user || !(await bcrypt.compare(sdkPwd, user.sdkPwd))) {
            return NextResponse.json({ success: false, token: '', msg: 'Invalid user or password!' }, { status: 400 });
        }

        const secretKey: string = crypto.randomBytes(32).toString('hex'); // Generate a random secret key 
        const expiresIn: number = process.env.LOGIN_EXPIRES ? parseInt(process.env.LOGIN_EXPIRES) : 600; // Default to 3600 seconds if not defined
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn });
        user.sdkPwd = null; // Prevent password from being sent in the response.
        
        // Setting the token in cookies with Secure and HttpOnly flags
        const res = NextResponse.json({ result: { id: user._id, usrName:user.sdkFstName, usrRole: user.sdkRole, usrToken: token, success: true } }, { status: 200 });
        res.cookies.set('token', token, { httpOnly: true, secure: true, maxAge: expiresIn });
        return res;
      }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving data: " + error, {status: 400});
    }
  }
};