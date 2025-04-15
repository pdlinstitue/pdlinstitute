import mongoose from "mongoose";
import Batches from "./Batches";
import Classes from "./Classes";
import Users from "./Users";

const attendanceSchema = new mongoose.Schema({    
    bthId:{
        type: mongoose.Types.ObjectId,
        ref: Batches
    },
    clsId:{
        type: mongoose.Types.ObjectId,
        ref: Classes
    },
    uploadedBy:{
        type: mongoose.Types.ObjectId,
        ref: Users
    },
    attdSreenShots:[String],
},{timestamps: true});
const Screenshots = mongoose.models.Screenshots || mongoose.model('Screenshots', attendanceSchema);
export default Screenshots;