import mongoose from "mongoose";
import Courses from "./Courses";
import Users from "./Users";


const batchSchema = new mongoose.Schema({
    bthName: {
        type: String,
    },
    bthTime: {
        type: String,
    },
    bthStart: {
        type: Date,
    },
    bthEnd: {
        type: Date,
    },
    bthVtr: {
        type: String,
    },
    bthWhatGrp: {
        type: String,
    },
    bthTeleGrp: {
        type: String,
    },
    bthLang: {
        type: String,
    },
    bthMode: {
        type: String,
    },
    bthLoc: {
        type: String,
    },
    bthLink: {
        type: String,
    },
    bthBank: {
        type: String,
    },
    bthQr: {
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
const Batches = mongoose.models.Batches || mongoose.model('Batches', batchSchema);
export default Batches;