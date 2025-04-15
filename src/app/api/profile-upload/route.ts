import { writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const IMAGE_DIR = "public/profile-images";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("profileImage") as File | null;
    const originalName = formData.get("profileImageFileName")?.toString();

    if (!file) {
      return NextResponse.json({ success: false, msg: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, msg: "Only JPG, JPEG, PNG or WEBP files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Optional: Resize or convert to a consistent format
    const processedBuffer = await sharp(buffer).toBuffer();

    // Generate safe filename
    const fileName = originalName?.split("/").pop() || `profileImage_${Date.now()}.jpeg`;
    const filePath = join(process.cwd(), IMAGE_DIR, fileName);

    // Save processed image to disk
    await writeFile(filePath, processedBuffer);

    // Revalidate page cache
    revalidatePath("/");

    return NextResponse.json({ success: true, imageUrl: `/profile-images/${fileName}` });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ success: false, msg: "Image upload failed" }, { status: 500 });
  }
}