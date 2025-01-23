import { NextResponse, NextRequest } from "next/server";
import Events from "../../../../../../modals/Events";
import dbConnect from "../../../../../../dbConnect";

interface IEveParams{
    EveId?: string;
}

type EveType = {
    eveName:string,
    eveCatId:string,
    eveAud:string,
    eveType:string,
    eveMode:string,
    eveDon:number,
    eveShort:string,
    eveStartAt:string,
    eveEndAt:string,
    eveDesc: string,
    eveDate:string,
    eveLink:string,
    eveLoc:string,
    eveSpeak:string,
    evePer:string,
    eveCont:string,
    eveImg?:string,
    usrId:string
  }

export async function PUT(req: NextRequest, {params}:{params:IEveParams}) {

  try 
  {
    await dbConnect();
    const { eveName, eveCatId, eveAud, eveType, eveMode, eveDon, eveShort, eveStartAt, eveEndAt, eveDesc, eveDate, eveLink, eveLoc, eveSpeak, evePer, eveCont, eveImg, usrId }: EveType = await req.json();
    const eveById = await Events.findByIdAndUpdate(params.EveId, {eveName, eveCatId, eveAud, eveType, eveMode, eveDon, eveShort, eveStartAt, eveEndAt, eveDesc, eveDate, eveLink, eveLoc, eveSpeak, evePer, eveCont, eveImg, usrId}, {runValidators:true});
    return NextResponse.json({ eveById, success: true, msg:"Event updated successfully." }, {status:200});

  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while updating course: " + error, {status: 400});
    }
  }
}

