import mongoose from "mongoose";
import Courses from "./Courses";
import Users from "./Users";


const assignmentsSchema = new mongoose.Schema({
    asnName: {
        type: String,
    },
    asnType: {
        type: String,
    },
    asnLink: {
        type: String,
    },
    asnOrder: {
        type: String,
    },
    asnFile: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default:true
    },
    corId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses
    },
    usrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    }
},{timestamps: true});
const Assignments = mongoose.models.Assignments || mongoose.model('Assignments', assignmentsSchema);
export default Assignments;