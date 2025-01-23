import mongoose from "mongoose";
import Courses from "./Courses";
import Users from "./Users";


const materialsSchema = new mongoose.Schema({
    matName: {
        type: String,
    },
    matType: {
        type: String,
    },
    matLink: {
        type: String,
    },
    matFile: {
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
const Materials = mongoose.models.Materials || mongoose.model('Materials', materialsSchema);
export default Materials;