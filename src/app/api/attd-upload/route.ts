import { writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const formData = await req.formData();
        const files: File[] = formData.getAll("attdImage").filter(file => file instanceof File) as File[];

        if (!files.length) {
            return NextResponse.json({ success: false, msg: "No files uploaded" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const imageUrls: string[] = [];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json({ success: false, msg: "Only JPG, JPEG, or PNG files are allowed" }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            // Resize image
            const resizedBuffer = await sharp(buffer)
                .resize(350, 800)
                .toFormat("jpeg")
                .toBuffer();

            // Generate unique filename
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 10000);
            const uniqueName = `attdImage_${timestamp}_${random}.jpeg`;
            const filePath = join(process.cwd(), "public/attd-images", uniqueName);

            // Save file to public folder
            await writeFile(filePath, resizedBuffer);

            imageUrls.push(`/attd-images/${uniqueName}`);
        }

        // Revalidate cache
        revalidatePath("/");
        return NextResponse.json({ success: true, imageUrls });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, msg: "Screenshots upload failed" }, { status: 500 });
    }
}
