import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../../dbConnect";
import Classes from "../../../../../../../modals/Classes";


type ClsType = {
  isActive: boolean;
  disabledBy: string;
};

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ ClsId: string, DayId: string }> }) {

  try {
    await dbConnect();
    const { ClsId, DayId } = await params;
    const { disabledBy }: ClsType = await req.json();

    const disClass = await Classes.findOneAndUpdate(
      { _id: ClsId, "clsName._id":DayId },
      { 
        $set: {
          "clsName.$.isActive": false,
          "clsName.$.disabledBy": disabledBy
        }
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ disClass, success: true, msg: "Class disabled successfully." }, { status: 200 });

  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, { status: 400 });
    } else {
      return new NextResponse("Error while disabling category: " + error, { status: 500 });
    }
  }
}