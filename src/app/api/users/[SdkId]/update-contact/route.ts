import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";
import { NextRequest, NextResponse } from "next/server";

type SdkType = {
    sdkPhone: string,
    sdkWhtNbr: string,
    sdkEmail: string,
    updatedBy?: string
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ SdkId: string }> }) {
  
  try {
    await dbConnect();
    const { SdkId } = await params;
    const { sdkPhone, sdkWhtNbr, sdkEmail, updatedBy }: SdkType = await req.json();
    
    const existingUser = await Users.findById(SdkId);

    if (!existingUser) {
      return NextResponse.json({ success: false, msg: "No Sadhak Found." }, { status: 404 });
    }

    // Only check for duplicates if any of the values are different from the existing ones
    if (sdkPhone !== existingUser.sdkPhone) {
      const phoneExists = await Users.findOne({ sdkPhone, _id: { $ne: SdkId } });
      if (phoneExists) {
        return NextResponse.json({ success: false, msg: "Another user with the same phone number already exists." }, { status: 400 });
      }
    } else if (sdkWhtNbr !== existingUser.sdkWhtNbr) {
      const whtNbrExists = await Users.findOne({ sdkWhtNbr, _id: { $ne: SdkId } });
      if (whtNbrExists) {
        return NextResponse.json({ success: false, msg: "Another user with the same WhatsApp number already exists." }, { status: 400 });
      }
    } else if (sdkEmail !== existingUser.sdkEmail) {
      const emailExists = await Users.findOne({ sdkEmail, _id: { $ne: SdkId } });
      if (emailExists) {
        return NextResponse.json({ success: false, msg: "Another user with the same email already exists." }, { status: 400 });
      }
    } else {
      // Proceed with update if the values are unchanged or no duplicates exist
      const sdkById = await Users.findByIdAndUpdate(
        SdkId,
        { sdkPhone, sdkWhtNbr, sdkEmail, updatedBy },
        { runValidators: true, new: true }
      );
      return NextResponse.json({ sdkById, success: true, msg: "Contact updated successfully." }, { status: 200 });
    }
  } catch (error:any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val:any) => val.message);
      return NextResponse.json({ success: false, msg: messages }, {status:400});
    }else{
      return new NextResponse ("Error while saving usrData: " + error, {status: 400});
    }
  }
}