import { writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
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

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ success: false, msg: "Only JPG, JPEG, or PNG files are allowed" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Resize image
        const resizedBuffer = await sharp(buffer)
            .resize(600, 350)
            .toFormat("jpeg")
            .toBuffer();

        // Generate unique filename
        const uniqueName = (fileName ? fileName.split('/').pop() : `courseImage_${Date.now()}.jpeg`) || `courseImage_${Date.now()}.jpeg`;
        const filePath = join(process.cwd(), "public/course-images", uniqueName);

        // Save file to public folder
        await writeFile(filePath, resizedBuffer);

        const imageUrl = `/course-images/${uniqueName}`;

        // Revalidate cache
        revalidatePath("/");
        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, msg: "Image upload failed" }, { status: 500 });
    }
}

