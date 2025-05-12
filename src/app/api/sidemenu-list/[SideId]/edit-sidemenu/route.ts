import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Sidemenues from "../../../../../../modals/Sidemenues";


type SideMenuType = {
    _id?: string;
    menuName:string;
    menuIcon:string;
    menuUrl:string;
    isParent?:boolean;
    isChild?:boolean;
    parentId?:mongoose.Types.ObjectId;
    updatedBy?:string;
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ SideId: string }>}) {

  try 
  {
    await dbConnect();
    const { SideId } = await params;
    const { menuName, menuIcon, menuUrl, isChild, isParent, parentId, updatedBy }: SideMenuType = await req.json();

    if(!SideId){
      return NextResponse.json({ message: "No menu found." }, { status: 404 });
    }else{
      const sideMenuById = await Sidemenues.findByIdAndUpdate(SideId, {menuName, menuIcon, menuUrl, isChild, isParent, parentId: parentId?new mongoose.Types.ObjectId(parentId):null, updatedBy}, {runValidators:true});
      return NextResponse.json({ sideMenuById, success: true, msg:"Sidemenu updated successfully." }, {status:200});
    }
    
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    } else if (error.code === 11000) {
      // Extract which field is duplicated
      const field = Object.keys(error.keyPattern)[0];
      const msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
      return NextResponse.json({ success: false, msg }, { status: 400 });
    } else {
      return new NextResponse("Error while saving menuData: " + error, { status: 500 });
    }
  }
}

