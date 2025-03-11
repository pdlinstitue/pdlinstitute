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
    sdkId:{
        type:mongoose.Types.ObjectId,
        ref:Users
    },
    status:{
        type:String,
        default:"Pending"
    },
    absRemarks:{
        type:String
    },
    atdSrnShot:[String],
    markedBy:{
        type:mongoose.Types.ObjectId,
        ref:Users
    }
},{timestamps: true});
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;