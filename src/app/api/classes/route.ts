import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Classes from "../../../../modals/Classes";
import Enrollments from "../../../../modals/Enrollments";

type clsItem = {
    clsDay: string;
    clsStartAt: string;
    clsEndAt: string;
    clsDate: string;
    clsLink: string;
    createdBy: string;
    clsAssignments: string[];
  }
  
type clsType = { 
    clsName: clsItem[];   
    corId: string; 
    bthId: string; 
    clsMaterials: string[]; 
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch all classes
        const clsList = await Classes.find()
            .populate('corId', 'coName coNick')
            .populate('bthId', 'bthName')
            .populate('clsName.createdBy', 'sdkFstName')
            .populate('clsName.updatedBy', 'sdkFstName');

        // Aggregate enrollments to count joiners for each corId and bthId
        const enrollmentCounts = await Enrollments.aggregate([
            {
                $group: {
                    _id: { corId: "$corId", bthId: "$bthId" },
                    joinersCount: { $sum: 1 }
                }
            }
        ]);

        // Create a map for quick lookup of joinersCount
        const countMap = new Map();
        enrollmentCounts.forEach(({ _id, joinersCount }) => {
            const key = `${_id.corId}_${_id.bthId}`;
            countMap.set(key, joinersCount);
        });

        // Attach joinersCount to each class in clsList
        const clsListWithCounts = clsList.map(cls => {
            const key = `${cls.corId._id}_${cls.bthId._id}`;
            const joinersCount = countMap.get(key) || 0;
            return { ...cls.toObject(), joinersCount };
        });

        return NextResponse.json({ clsList: clsListWithCounts, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error while fetching clsData:", error);
        return new NextResponse("Error while fetching clsData: " + error, { status: 500 });
    }
}
  
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const classData = await req.json();
        const classNewData: clsType = classData.postData;
        const newClass = new Classes({
            clsName: classNewData.clsName,
            corId: classNewData.corId,
            bthId: classNewData.bthId,
            clsMaterials: classNewData.clsMaterials
        });
        
        const savedClass = await newClass.save();

        if (savedClass) {
            return NextResponse.json({ savedClass, success: true, msg: "Class created successfully." }, { status: 200 });
        } else {
            return NextResponse.json({ savedClass, success: false, msg: "Class creation failed." }, { status: 200 });
        }
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return NextResponse.json({ success: false, msg: messages }, { status: 400 });
        } else {
            return new NextResponse("Error while saving data: " + error, { status: 400 });
        }
    }
}