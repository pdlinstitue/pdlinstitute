import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import mongoose from "mongoose";
import Menuaccess from "../../../../modals/Menuaccess";


type SideMenuType = {
    roleId:mongoose.Schema.Types.ObjectId;
    menuId:[mongoose.Schema.Types.ObjectId];
    createdBy?:string;
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const accessList: SideMenuType[] = await Menuaccess.find({isActive: true})
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName')
      .sort({ createdAt: -1 });
      
      if (!accessList) {
        return NextResponse.json({success:false, msg: "No menu access found" }, { status: 404 });
      } else {
        return NextResponse.json({ accessList, success: true }, {status:200});
      }
    } catch (error) {
        return new NextResponse("Error while fetching accessData: " + error, {status:500});
    }
  }
  
  export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { roleId, menuId, createdBy }: SideMenuType = await req.json();
  
      const newMenuAccess = new Menuaccess({ roleId, menuId, createdBy });
      const savedMenuAccess = await newMenuAccess.save();
  
      return NextResponse.json({ savedMenuAccess, success: true, msg:"Access given successfully." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving menuData: " + error, {status: 500});
      }
    }
  }