import { NextResponse, NextRequest } from "next/server";
import Categories from "../../../../../../modals/Categories";
import Courses from "../../../../../../modals/Courses";
import dbConnect from "../../../../../../dbConnect";


export async function DELETE(req: Request,{ params }: { params: Promise<{ CatId: string }>}) {

    try {
        await dbConnect();
        const { CatId } = await params;
        const isCategoryUsed = await Courses.findOne({ coCat: CatId });

        if (isCategoryUsed) {
            return NextResponse.json({success:false, msg: "Category is being used. Can't be deleted." }, { status: 400 });
        }else{
            const delCat = await Categories.findByIdAndDelete(CatId);
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
