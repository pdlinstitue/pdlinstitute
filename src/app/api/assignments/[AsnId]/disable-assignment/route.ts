import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../dbConnect";
import Assignments from "../../../../../../modals/Assignments";
import Classes from "../../../../../../modals/Classes";

interface IAsnParams{
    AsnId?: string;
}

export async function PATCH(req: NextRequest, {params}:{params:IAsnParams}) {

    try 
    {
      await dbConnect();
      const classes = await Classes.aggregate([ { $unwind: "$clsName" }, { $match: { "clsName.clsAssignments": params.AsnId } }, { $limit: 1 } ]); 
      const isAssignmentUsed = classes.length > 0;

      if (isAssignmentUsed) {
          return NextResponse.json({success:false, msg: "Assignment is being used. Can't be disabled." }, { status: 400 });
      }else{

        const asnById = await Assignments.findByIdAndUpdate(params.AsnId, {isActive:false}, {runValidators:false});
        return NextResponse.json({ asnById, success: true, msg:"Assignment disabled successfully." }, {status:200});   
      }
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving data: " + error, {status: 400});
      }
    }
  }