import mongoose from "mongoose";
import Batches from "./Batches";
import Courses from "./Courses";
import Users from "./Users";
 
const classSchema = new mongoose.Schema({
clsName: [{
    clsDay: {
        type: String,
    },
    clsStartAt: {
        type: String,
        },
    clsEndAt: {
        type: String,
        },
    clsDate: {
        type: Date,
    },
    clsLink: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    clsAssignments: [String],
}],
clsMaterials: [String],
bthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Batches
},
corId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Courses
},
usrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users
},  
isActive: {
    type: Boolean,
    default: true
},
}, {timestamps: true});

const Classes = mongoose.models.Classes || mongoose.model('Classes', classSchema);
export default Classes;
