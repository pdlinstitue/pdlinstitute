import mongoose from "mongoose";
import Courses from "./Courses";
import Batches from "./Batches";
import Enrollments from "./Enrollments";
import Classes from "./Classes";

const attendanceSchema = new mongoose.Schema({    
    clsId:{
        type: mongoose.Types.ObjectId,
        ref: Classes
    },
    isPresent:{
        type:Boolean
    },
    enrId:{
        type:mongoose.Types.ObjectId,
        ref:Enrollments
    },
    absRemarks:{
        type:String
    },
    atdScreenShot:[],
    usrId:{
        type:String  //a loggedin admin user who marks the attendance
    }
},{timestamps: true});
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;