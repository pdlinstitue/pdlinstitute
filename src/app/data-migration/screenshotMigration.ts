import mongoose from "mongoose";
import Screenshots from "../../../modals/Screenshots";
import fs from "fs";
import csv from "csv-parser";
import Classes from "../../../modals/Classes";

interface ScreenshotData {
  clsId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  attdSreenShots: string;
  createdAt: Date;
  updatedAt: Date;
}

const filePath = "D:\\screenshots.csv";

export default function migrateScreenshotData() {
  const data: ScreenshotData[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const cleanedRow: ScreenshotData = {
        clsId: new mongoose.Types.ObjectId(row.clsId),
        uploadedBy: new mongoose.Types.ObjectId(row.uploadedBy),
        attdSreenShots: row.attdSreenShots,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };
      data.push(cleanedRow);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");

      await mongoose.connect(process.env.MONGO_URL as string);
      const classList = await Classes.find();

      const groupedData: Record<
        string,
        {
          clsId: mongoose.Types.ObjectId;
          uploadedBy: mongoose.Types.ObjectId;
          attdSreenShots: string[];
          bthId: mongoose.Types.ObjectId | null;
          createdAt:Date,
          updatedAt:Date
        }
      > = {};

      for (const item of data) {
        const key = `${item.clsId}-${item.uploadedBy}`;

        if (!groupedData[key]) {
          const matchedClass = classList.find((cls: any) =>
            cls.clsName.some((cn: any) => cn._id.equals(item.clsId))
          );

          groupedData[key] = {
            clsId: item.clsId,
            uploadedBy: item.uploadedBy,
            attdSreenShots: [],
            bthId: matchedClass?.bthId || null,
            createdAt:item.createdAt,
            updatedAt:item.updatedAt,
          };
        }

        groupedData[key].attdSreenShots.push(item.attdSreenShots);
      }

      const screenshots = Object.values(groupedData);
      await Screenshots.insertMany(screenshots);
      console.log("Data inserted successfully");

      await mongoose.disconnect();
    });
}