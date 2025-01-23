import Batches from "../../../../modals/Batches";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";
import Classes from "../../../../modals/Classes";

type clsItem = {
    clsDay: string;
    clsStartAt: string;
    clsEndAt: string;
    clsDate: string;
    clsLink: string;
    clsAssignments: string[];
  }
  
type clsType = { 
    clsName: clsItem[];   
    corId: string; 
    bthId: string; 
    clsMaterials: string[]; 
    usrId: string;   
  }

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const clsList: clsType[] = await Classes.find()
            .populate('corId', 'coName coNick')
            .populate('bthId', 'bthName');
        return NextResponse.json({ clsList, success: true }, { status: 200 });
    } catch (error) {
        return new NextResponse("Error while fetching clsData: " + error, { status: 500 });
    }
}
  
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const classData = await req.json();
        const classNewData:clsType=classData.postData;
        const newClass = new Classes({
            clsName: classNewData.clsName,
            corId: classNewData.corId,
            bthId: classNewData.bthId,
            //usrId: classNewData.usrId,
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