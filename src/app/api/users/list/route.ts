import Users from "../../../../../modals/Users";
import dbConnect from "../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

type SdkType = {
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkEdc: string;
  sdkOcp: string;
  sdkBthDate: Date;
  sdkGender: string;
  sdkMarStts: string;
  sdkSpouce: string;
  sdkPhone: string;
  sdkWhtNbr: string;
  sdkEmail: string;
  sdkCountry: string;
  sdkState: string;
  sdkCity: string;
  sdkComAdds: string;
  sdkParAdds: string;
  sdkPwd: string;
  isActive: boolean;
  sdkImg: string;
  sdkRole: string;
  createdBy?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const usrRole = searchParams.get("usrRole");

    await dbConnect();
    let activeSdkList: SdkType[] = await Users.find({ isActive: true }).sort({
      createdAt: -1,
    });

    if (usrRole && usrRole === "Admin") {
      activeSdkList = activeSdkList.filter(
        (sdk: SdkType) =>
          sdk.sdkRole !== "Admin" && sdk.sdkRole !== "Super-Admin"
      );
    }
    return NextResponse.json({ activeSdkList, success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error while fetching sadhakData: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      usrRole,
      pageNumber,
      pageSize,
      search
    } = await req.json();

    const skip = (pageNumber - 1) * pageSize;

    await dbConnect();

    // Base filter
    const filter: any = { isActive: true };

    // Role-based filter
    if (usrRole === "Admin") {
      filter.sdkRole = { $nin: ["Admin", "Super-Admin"] };
    }

    // Search filter
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      filter.$or = [
        { sdkFstName: regex },
        { sdkMdlName: regex },
        { sdkLstName: regex },
        { sdkRegNo: regex },
        { sdkPhone: regex },
        { sdkEmail: regex },
        { sdkState: regex },
        { sdkCountry: regex },
      ];
    }

    const totalCount = await Users.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    let activeSdkList: SdkType[] = await Users.find(filter)
      .sort({ createdAt: -1 });

    activeSdkList = activeSdkList.slice(skip, skip + pageSize);

    return NextResponse.json(
      {
        activeSdkList,
        currentPage: pageNumber,
        totalPages,
        totalCount,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error while fetching sadhakData: " + error.message },
      { status: 500 }
    );
  }
}