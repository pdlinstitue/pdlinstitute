import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import dbConnect from "../../../../../../dbConnect";

interface ICatParams{
    CatId?: string;
}

export async function GET(req:NextRequest, {params}:{params:ICatParams}){

    try {
  
      await dbConnect();
      const catById = await Categories.findById(params.CatId);

      if(!catById){
        return NextResponse.json({ message: "No category found." }, { status: 404 });
      }else{
        return NextResponse.json({ catById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }

