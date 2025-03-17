import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import dbConnect from "../../../../../../dbConnect";


export async function GET(req: Request,{ params }: { params: Promise<{ CatId: string }>}){

    try {
  
      await dbConnect();
      const { CatId } = await params;
      const catById = await Categories.findById(CatId);

      if(!catById){
        return NextResponse.json({ message: "No category found." }, { status: 404 });
      }else{
        return NextResponse.json({ catById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }

