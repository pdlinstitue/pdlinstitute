import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import dbConnect from "../../../../../../dbConnect";

interface ICatParams{
    CatId?: string;
}

type CatType = {
  _id?: string;
  catName:string;
  updatedBy?:string;
}

export async function PUT(req: NextRequest, {params}:{params:ICatParams}) {

  try 
  {
    await dbConnect();
    
    const { catName, updatedBy }: CatType = await req.json();
    const catById = await Categories.findByIdAndUpdate(params.CatId, {catName, updatedBy}, {runValidators:true});

    if(!catById){
      return NextResponse.json({ message: "No category found." }, { status: 404 });
    }else{
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

