import Categories from "../../../../modals/Categories";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

type CatType = {
    _id?: string;
    catName:string;
    createdBy?:string;
}

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const catList: CatType[] = await Categories.find()
      .populate('createdBy', 'sdkFstName')
      .populate('updatedBy', 'sdkFstName');
      const categoryList = catList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ catList:categoryList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching catData: " + error, {status:500});
    }
  }
  
  export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { catName, createdBy }: CatType = await req.json();
  
      const newCategory = new Categories({ catName, createdBy });
      const savedCategory = await newCategory.save();
  
      return NextResponse.json({ savedCategory, success: true, msg:"Category created successfully." }, {status:200});
  
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving catData: " + error, {status: 500});
      }
    }
  }