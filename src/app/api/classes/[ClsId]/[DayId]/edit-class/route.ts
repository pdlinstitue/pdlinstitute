import { NextResponse, NextRequest } from "next/server";
import Classes from "../../../../../../../modals/Classes";
import dbConnect from "../../../../../../../dbConnect";

type ClsItem = {
  clsDay: string;
  clsStartAt: string;
  clsEndAt: string;
  clsDate: string;
  clsLink: string;
  updatedBy: string;
  clsAssignments: string[];
};

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ ClsId: string, DayId: string }> }) {

  try {
    await dbConnect();
    const { ClsId, DayId } = await params;
    const { clsDay, clsStartAt, clsEndAt, clsDate, clsLink, clsAssignments, updatedBy }: ClsItem = await req.json();

    const updatedClass = await Classes.findOneAndUpdate(
      { _id: ClsId, "clsName._id": DayId },
      {
        $set: {
          "clsName.$": {
            clsDay,
            clsStartAt,
            clsEndAt,
            clsDate,
            clsLink,
            clsAssignments,
            updatedBy,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return NextResponse.json({ msg: "No class found." }, { status: 404 });
    } else {
      return NextResponse.json({ updatedClass, success: true, msg: "Class updated successfully." }, { status: 200 });
    }

  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    } else {
      return NextResponse.json({ success: false, msg: "Error while saving classData: " + error.message }, { status: 500 });
    }
  }
}