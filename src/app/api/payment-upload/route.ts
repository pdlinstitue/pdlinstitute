import fs, { writeFile, mkdir, chmod } from "fs/promises";
import path, { dirname } from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { UPLOAD_PATH } from "@/app/utils/constant";
import { verifyApiToken } from "@/app/utils/auth";

export async function GET(req: NextRequest) {

    await verifyApiToken();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
  
    if (!name) {
      return NextResponse.json({ error: "No image name provided" }, { status: 400 });
    }
  
    const filePath = path.resolve(`${UPLOAD_PATH}/payment-images`, name.replace("/payment-images/", ""));
  
    try {
      const file = await fs.readFile(filePath);
      return new NextResponse(file, {
        headers: {
          "Content-Type": "image/jpeg", // or "image/png" depending on your case
        },
      });
    } catch (err) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
}  

export async function POST(req: NextRequest) {
  try {

      await verifyApiToken();
      const formData = await req.formData();
      const file = formData.get("paymentImage");
      const fileName = formData.get("paymentImageFileName")?.toString() || "";

      if (!file) {
          return NextResponse.json({ success: false, msg: "No file uploaded" }, { status: 400 });
      }

      if (!(file instanceof File)) {
          return NextResponse.json({ success: false, msg: "Invalid file type" }, { status: 400 });
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ success: false, msg: "Only JPG, JPEG, or PNG files are allowed" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Resize image with padding and light gray background, maintaining aspect ratio
      const resizedBuffer = await sharp(buffer)
      .resize(600, 800, {
        fit: "contain",
        background: { r: 200, g: 200, b: 200, alpha: 1 }, // light gray background
      })
      .toFormat("jpeg", { quality: 80 }) // optimized JPEG
      .toBuffer();


      let uniqueName = fileName?.split("/").pop() || `paymentImage_${Date.now()}.jpeg`;
      if (!uniqueName || uniqueName === "undefined" || uniqueName === "null") {
          uniqueName = `paymentImage_${Date.now()}.jpeg`;
      }

      if (!UPLOAD_PATH) {
          console.error("UPLOAD_PATH is not defined.");
          return NextResponse.json({ success: false, msg: "Server misconfiguration: upload path not set" }, { status: 500 });
      }

      const filePath = path.resolve(`${UPLOAD_PATH}/payment-images`, uniqueName);

      // Ensure directory exists
      await mkdir(dirname(filePath), { recursive: true });

      await writeFile(filePath, resizedBuffer);
      await chmod(filePath, 0o644);

      const imageUrl = `/payment-images/${uniqueName}`;

      revalidatePath("/");
      return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
      console.error("Upload error:", error instanceof Error ? error.message : error);
      return NextResponse.json({ success: false, msg: "Pan upload failed" }, { status: 500 });
  }
}