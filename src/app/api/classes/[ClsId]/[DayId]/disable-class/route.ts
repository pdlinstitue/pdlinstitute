import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../../../dbConnect";
import Classes from "../../../../../../../modals/Classes";

interface IClsParams {
  ClsId?: string;
  DayId:string;
}

type ClsType = {
  disabledBy: string;
}

export async function PATCH(req: NextRequest, {params}:{params:IClsParams}) {

  try 
    {
      await dbConnect();
      const { disabledBy }: ClsType = await req.json();
      const delClass = await Classes.findOneAndUpdate({ _id: params.ClsId, "clsName._id": params.DayId },
        { $set: {
            "clsName.$": {
              isActive:false,
              disabledBy
            },
          },
        },
        { new: true, runValidators: true }
      );
      return NextResponse.json({ delClass, success: true, msg:"Class disabled successfully." }, {status:200}); 

    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val:any) => val.message);
        return NextResponse.json({ success: false, msg: messages }, {status:400});
      }else{
        return new NextResponse ("Error while disabling category: " + error, {status: 500});
      }
    }
  }

