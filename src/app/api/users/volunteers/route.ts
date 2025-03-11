import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

type SdkType = {
    _id:string,
    sdkFstName: string
}

export async function GET () {
    try {
      await dbConnect();
      const activeVolList: SdkType[] = await Users.find({
        isActive: true,
        isVolunteer: "Yes"
      });
      return NextResponse.json({ volList: activeVolList, success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: "Error while fetching sadhakData: " + error.message }, { status: 500 });
    }
  }
  