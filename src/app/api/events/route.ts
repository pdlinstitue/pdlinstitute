import Events from "../../../../modals/Events";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect";

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

export async function GET(req:NextRequest){

    try {
  
      await dbConnect();
      const eveList:EveType[] = await Events.find().populate('eveCatId', 'eveCatName');
      const activeEveList = eveList.filter((item:any)=> item.isActive === true);
      return NextResponse.json({ eveList:activeEveList, success: true }, {status:200});
  
    } catch (error) {
      return new NextResponse("Error while fetching eventData: " + error, {status:500});
    }
  }
  
export async function POST(req: NextRequest) {
  
    try {
  
      await dbConnect();
      const { eveName, eveCatId, eveAud, eveType, eveMode, eveDon, eveShort, eveStartAt, eveEndAt, eveDesc, eveDate, eveLink, eveLoc, eveSpeak, evePer, eveCont, eveImg, usrId }: EveType = await req.json();
  
      const newEvent = new Events({ eveName, eveCatId, eveAud, eveType, eveMode, eveDon, eveShort, eveStartAt, eveEndAt, eveDesc, eveDate, eveLink, eveLoc, eveSpeak, evePer, eveCont, eveImg, usrId});
      const savedEvent = await newEvent.save();

      if(savedEvent){
        return NextResponse.json({ savedEvent, success: true, msg:"Event created successfully." }, {status:200});
      }else{
        return NextResponse.json({ savedEvent, success: false, msg:"Event creation failed." }, {status:200});
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