import mongoose from "mongoose";
import Courses from "./Courses";
import Users from "./Users";

const batchSchema = new mongoose.Schema({
    bthName: {
        type: String,
    },
    bthShift: {
        type: String,
        required: [true, 'Please select shift.']
    },
    bthStart: {
        type: Date,
    },
    bthEnd: {
        type: Date,
    },
    bthVtr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    bthWhatGrp: {
        type: String,
    },
    bthTeleGrp: {
        type: String,
    },
    bthLang: {
        type: String,
        required: [true, 'Please select language.']
    },
    bthMode: {
        type: String,
        required: [true, 'Please select mode of batch.']
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
    isDeleted: {
        type: Boolean,
        default:false
    },
    corId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses,
        required: [true, 'Please select course.']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
    },
    disabledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
    }
},{timestamps: true});
const Batches = mongoose.models.Batches || mongoose.model('Batches', batchSchema);
export default Batches;