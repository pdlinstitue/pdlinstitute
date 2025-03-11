import { NextResponse, NextRequest } from "next/server";
import Classes from "../../../../../../../modals/Classes";
import dbConnect from "../../../../../../../dbConnect";

interface IClassParams{
    ClsId?: string;
    DayId:string;
}

export async function GET(req:NextRequest, {params}:{params:IClassParams}){

    try {
  
      await dbConnect();
      const clsData = await Classes.findById(params.ClsId);
      let clsById = clsData.clsName?.filter((a: any) => a._id.toString() === params.DayId)[0];

      if(!clsById){
        return NextResponse.json({ msg: "No class found." }, { status: 404 });
      }else{
        return NextResponse.json({ clsById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching classData: " + error, {status:500});
    }
  }

