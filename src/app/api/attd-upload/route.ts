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
  
    const filePath = path.resolve(`${UPLOAD_PATH}/attd-images`, name.replace("/attd-images/", ""));
  
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
    const files: File[] = formData.getAll("attdImage").filter(item => item instanceof File) as File[];

    if (files.length === 0) {
      return NextResponse.json({ success: false, msg: "No files uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const savedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, msg: `Invalid file type: ${file.name}` }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const resizedBuffer = await sharp(buffer)
        .resize(350, 900, {
          fit: "contain",
          background: { r: 200, g: 200, b: 200, alpha: 1 },
        })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileName = `attdImage_${Date.now()}_${i}.jpeg`;
      const filePath = path.resolve(`${UPLOAD_PATH}/attd-images`, fileName);

      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, resizedBuffer);
      await chmod(filePath, 0o644);

      savedFiles.push(`/attd-images/${fileName}`);
    }

    revalidatePath("/");

    return NextResponse.json({ success: true, imageUrls: savedFiles });
  } catch (error) {
    console.error("Upload error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, msg: "Image upload failed" }, { status: 500 });
  }
}