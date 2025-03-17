import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import dbConnect from "../../../../../../dbConnect";

type CatType = {
  _id?: string;
  catName:string;
  updatedBy?:string;
}

export async function PUT(req: Request,{ params }: { params: Promise<{ CatId: string }>}) {

  try 
  {
    await dbConnect();
    const { CatId } = await params;
    const { catName, updatedBy }: CatType = await req.json();

    if(!CatId){
      return NextResponse.json({ message: "No category found." }, { status: 404 });
    }else{
      const catById = await Categories.findByIdAndUpdate(CatId, {catName, updatedBy}, {runValidators:true});
      return NextResponse.json({ catById, success: true, msg:"Category updated successfully." }, {status:200});
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

