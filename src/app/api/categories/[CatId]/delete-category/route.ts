import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import Courses from "../../../../../../modals/Courses";
import dbConnect from "../../../../../../dbConnect";

interface ICatParams {
    CatId: string;
}

export async function DELETE(req: NextRequest, {params}:{params: ICatParams}):Promise<NextResponse> {

    try {
        await dbConnect();
        const isCategoryUsed = await Courses.findOne({ coCat: params.CatId });

        if (isCategoryUsed) {
            return NextResponse.json({success:false, msg: "Category is being used. Can't be deleted." }, { status: 400 });
        }else{
            const delCat = await Categories.findByIdAndDelete(params.CatId);
            return NextResponse.json({delCat, success:true, msg: "Category deleted successfully." }, { status: 200 });
        }
    } catch (error:any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val:any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while deleting data: " + error, { status: 400 });
        }
    }
}
