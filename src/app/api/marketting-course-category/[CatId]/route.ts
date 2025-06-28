import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../modals/Categories";
import dbConnect from "../../../../../dbConnect";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ CatId: string }>}){

    try {

      await dbConnect();
      const { CatId } = await params;
      const mktCoCategory = await Categories.findById(CatId);

      if(!mktCoCategory){
        return NextResponse.json({ msg: "No category found." }, { status: 404 });
      }else{
        return NextResponse.json({ mktCoCategory, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }

