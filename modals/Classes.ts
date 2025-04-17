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
    isDeleted: {
        type: Boolean,
        default:false
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
    },
    clsAssignments: [String],
}],
clsMaterials: [String],
bthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Batches,
    required:[true, 'Please select batch.']
},
corId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Courses,
    required:[true, 'Please select course.']
}
}, {timestamps: true});

const Classes = mongoose.models.Classes || mongoose.model('Classes', classSchema);
export default Classes;
