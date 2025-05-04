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
    parentId?:mongoose.Schema.Types.ObjectId;
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
      const sideById = await Sidemenues.findByIdAndUpdate(SideId, {menuName, menuIcon, menuUrl, isChild, isParent, parentId, updatedBy}, {runValidators:true});
      return NextResponse.json({ sideById, success: true, msg:"Sidemenu updated successfully." }, {status:200});
    }
    
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving catData: " + error, {status: 500});
    }
  }
}

