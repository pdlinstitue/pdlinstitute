import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../modals/Users";
import dbConnect from "../../../../dbConnect";
import crypto from 'crypto';
import bcrypt from "bcryptjs";

export const PUT = async (request:NextRequest) =>{

try 
    {
        const {token, sdkPwd, confPwd} = await request.json();

        await dbConnect();
        const resetLink = crypto.createHash('sha256').update(token).digest('hex');
        const user = await Users.findOne({pwdResetToken:resetLink, pwdResetTokenExpires: {$gt: Date.now()}});

        //If the user exists with the given resetLink and the link has not expired.
        if(!user){
            return NextResponse.json({ success: false, msg: 'The reset link is invalid or has expired...!' }, {status:400}); 
        }else{
            if (!(sdkPwd === confPwd)) {
                return NextResponse.json({ success: false,  msg: "Password & Confirm password does not match." }, { status: 400 });
            }else{
                
                const hashedPwd = await bcrypt.hash(sdkPwd, 12);
                user.sdkPwd = hashedPwd;
                user.pwdResetToken = undefined;
                user.pwdResetTokenExpires = undefined;
                await user.save({runValidators: true}); 
                return NextResponse.json({ success: true, msg: 'Password reset successfully.' }, {status:200}); 
            }
        }
    } catch(error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, {status:400});
        }else{
            return new NextResponse ("Error while posting data: " + error, {status: 400});
        }
    }
}