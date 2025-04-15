import mongoose, { ObjectId } from "mongoose";
import Classes from "../../../modals/Classes";
import fs from "fs";
import csv from "csv-parser";

interface classData {
    _id: string;
    corId: mongoose.Schema.Types.ObjectId;
    bthId: mongoose.Schema.Types.ObjectId;
    clsDay: string;
    clsDate:Date,
    clsStartAt:string,
    clsEndAt:string,
    clsLink:string,
    isActive:boolean,
    isDeleted:boolean,
    createdAt:Date,
    updatedAt:Date,
}

const filePath = "D:\\classData.csv";

export default function migrateClsData() {

    const data:classData[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const cleanedRow: classData = {
          _id: row._id,
          corId: row.corId,
          bthId: row.bthId,
          clsDay: row.clsDay, 
          clsDate: new Date(row.clsDate),
          clsStartAt: row.clsStartAt,
          clsEndAt: row.clsEndAt,
          clsLink: row.clsLink,
          isActive: row.isActive?.toLowerCase() === "true",
          isDeleted: row.isDeleted?.toLowerCase() === "true",
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        };
        data.push(cleanedRow);
      })
      .on("end", async () => {
        console.log("CSV file successfully processed");
        // Group by corId and bthId
        const groupedData:any = {};
        data.forEach((item) => {
          const key = `${item.corId}-${item.bthId}`;
          if (!groupedData[key]) {
            groupedData[key] = { corId: item.corId, bthId: item.bthId, clsName: [] };
          }
          groupedData[key].clsName.push(item);
        });
  
        const classes = Object.values(groupedData); 
        await mongoose.connect(process.env.MONGO_URL as string); 
        await Classes.insertMany(classes);
        console.log("Data inserted successfully");
        mongoose.disconnect();
      });
  }