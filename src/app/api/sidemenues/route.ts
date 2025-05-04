import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Sidemenues from "../../../../modals/Sidemenues";
import mongoose from "mongoose";


type SideMenuType = {
    _id?: string;
    menuName:string;
    menuIcon:string;
    menuUrl:string;
    isActive?:boolean;
    isParent?:boolean;
    isChild?:boolean;
    parentId?:mongoose.Schema.Types.ObjectId;
    createdBy?:string;
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const menuList: SideMenuType[] = await Sidemenues.find({isActive: true})
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName')
      .sort({ createdAt: -1 });
      
      if (!menuList) {
        return NextResponse.json({success:false, msg: "No menu found" }, { status: 404 });
      } else {
        return NextResponse.json({ menuList, success: true }, {status:200});
      }
    } catch (error) {
        return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }
  
  export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { menuName, menuIcon, menuUrl, isChild, isParent, parentId, createdBy }: SideMenuType = await req.json();
  
      const newMenu = new Sidemenues({ menuName, menuIcon, menuUrl, isChild, isParent, parentId, createdBy });
      const savedMenu = await newMenu.save();
  
      return NextResponse.json({ savedMenu, success: true, msg:"Menu created successfully." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving menuData: " + error, {status: 500});
      }
    }
  }