import mongoose from "mongoose";
import Users from "./Users";
import Batches from "./Batches";
import Courses from "./Courses";

const classSchema = new mongoose.Schema({
    clsName: [String],
    clsStart: {
        type: String,
        required: [true, "Class start time is required."]
    },
    clsEnd: {
        type: String,
        required: [true, "Class end time is required."]
    },
    clsLink: {
        type: String,
    },
    corId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: Courses
    },
    isActive :{
        type: Boolean,
        default:true
    },
    bthId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: Batches
    },
    usrId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    clsAssign:[String],
    clsMaterial:[String]
},{timestamps: true});
const Classes = mongoose.models.Classes || mongoose.model('Classes', classSchema);
export default Classes;