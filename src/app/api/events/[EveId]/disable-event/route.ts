import { NextResponse, NextRequest } from "next/server";
import Events from "../../../../../../modals/Events";
import dbConnect from "../../../../../../dbConnect";


interface IEveParams{
    EveId: string;
}

export async function PATCH(req: NextRequest, {params}:{params:IEveParams}) {

    try 
    {
      await dbConnect();
      const eveById = await Events.findByIdAndUpdate(params.EveId, {isActive:false}, {runValidators:false});

      if (!eveById) { 
        return new NextResponse("Event not found", { status: 404 }); 
      } else {
        return NextResponse.json({ eveById, success: true, msg: "Event disabled successfully." }, { status: 200 });
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