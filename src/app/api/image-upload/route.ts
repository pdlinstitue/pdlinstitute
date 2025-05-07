import { writeFile, mkdir,chmod } from "fs/promises";
import path, { dirname } from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { UPLOAD_PATH } from "@/app/utils/constant";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("courseImage");
        const fileName = formData.get("courseImageFileName")?.toString() || "";

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

        const resizedBuffer = await sharp(buffer)
            .resize(600, 350)
            .toFormat("jpeg")
            .toBuffer();

        let uniqueName = fileName?.split("/").pop() || `courseImage_${Date.now()}.jpeg`;
        if (!uniqueName || uniqueName === "undefined" || uniqueName === "null") {
            uniqueName = `courseImage_${Date.now()}.jpeg`;
        }

        if (!UPLOAD_PATH) {
            console.error("UPLOAD_PATH is not defined.");
            return NextResponse.json({ success: false, msg: "Server misconfiguration: upload path not set" }, { status: 500 });
        }

        const filePath = path.resolve(`${UPLOAD_PATH}/course-images`, uniqueName);

        // Ensure directory exists
        await mkdir(dirname(filePath), { recursive: true });

        await writeFile(filePath, resizedBuffer);
        await chmod(filePath, 0o644);

        const imageUrl = `/uploads/course-images/${uniqueName}`;

        revalidatePath("/");
        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error("Upload error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ success: false, msg: "Image upload failed" }, { status: 500 });
    }
}