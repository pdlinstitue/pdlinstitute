import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../dbConnect';
import Materials from '../../../../../../modals/Materials';
import Courses from '../../../../../../modals/Courses';

interface IMatParams {
    MatId: string;
}

export async function GET(req: NextRequest, { params }: { params: IMatParams }) {
    try {
        await dbConnect();
        const matById = await Materials.findById(params.MatId);

        const course = await Courses.findById(matById.corId);

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        } else {
            const matWithCourseName = {
                ...matById.toObject(),
                corId: course.coName,
            };
    
            return NextResponse.json({matById: matWithCourseName, success: true }, { status: 200 });
        }
    } catch (error) {
        return new NextResponse("Error while fetching course data: " + error, { status: 500 });
    }
}
