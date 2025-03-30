import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Enquiries from "../../../../modals/Enquiries";

type EqrType = {
    eqrName:string,
    eqrMessage:string,
    eqrEmail:string,
    eqrPhone:string,
    eqrSub:string
}

export async function GET() {

    try {

        await dbConnect();
        const eqrList = await Enquiries.find({ isActive: true })
        .sort({createdAt:-1});

        if (Array.isArray(eqrList) && eqrList.length > 0){
            return NextResponse.json({ success: true, eqrList }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, msg:"No Enquiry found." }, { status: 200 });
        }           
    } catch (error:any) {
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}

export async function POST(req:NextRequest) {
    try {

        await dbConnect();
        const {eqrName, eqrEmail, eqrPhone, eqrSub, eqrMessage} :EqrType = await req.json();
        const newEnquiry = new Enquiries({ eqrName, eqrEmail, eqrPhone, eqrSub, eqrMessage});
        const savedEnquiry = await newEnquiry.save();

        if(savedEnquiry){
            return NextResponse.json({ savedEnquiry, success: true, msg:"Enquiry submitted." }, {status:200});
        }else{
            return NextResponse.json({ savedEnquiry, success: false, msg:"Enquiry failed." }, {status:200});
        }
    } catch (error:any) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map((val:any) => val.message);
          return NextResponse.json({ success: false, msg: messages }, {status:400});
        }else{
          return new NextResponse ("Error while saving eqrData: " + error, {status: 400});
        }
      }
}