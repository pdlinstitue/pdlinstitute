import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Menuaccess from "../../../../../../modals/Menuaccess";

type MenuAccessType = {
    _id?: string;
    menuId:[mongoose.Schema.Types.ObjectId];
    roleId:mongoose.Schema.Types.ObjectId;
    updatedBy?:string;
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ MacId: string }>}) {

  try 
  {
    await dbConnect();
    const { MacId } = await params;
    const { menuId, roleId, updatedBy }: MenuAccessType = await req.json();

    if(!MacId){
      return NextResponse.json({ message: "No menu-access found." }, { status: 404 });
    }else{
      const menuAccById = await Menuaccess.findByIdAndUpdate(MacId, {menuId, roleId, updatedBy}, {runValidators:true});
      return NextResponse.json({ menuAccById, success: true, msg:"Access updated successfully." }, {status:200});
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

