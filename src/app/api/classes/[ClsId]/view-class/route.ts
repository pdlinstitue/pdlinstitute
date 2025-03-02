import { NextResponse, NextRequest } from "next/server";
import Classes from "../../../../../../modals/Classes";
import dbConnect from "../../../../../../dbConnect";

interface IBthParams{
    ClsId?: string;
}

export async function GET(req:NextRequest, {params}:{params:IBthParams}){

    try {
  
      await dbConnect();
      const clsById = await Classes.findById(params.ClsId);

      if(!clsById){
        return NextResponse.json({ msg: "No class found." }, { status: 404 });
      }else{
        return NextResponse.json({ clsById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching classData: " + error, {status:500});
    }
  }

