import mongoose from "mongoose";
import Users from "./Users";
import Courses from "./Courses";
  
const practiceSchema = new mongoose.Schema({   
    prcName: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses
    },
    prcImg: {
        type: String
    },
    prcLang:{
        type: String,
        required: [true, "Please select language."]
    },
    prcDays: [String],
    prcDate:Date,
    prcStartsAt: {
        type: String,
        required: [true, "Please provide start time."]
    },
    prcEndsAt: {
        type: String,
        required: [true, "Please provide end time."]
     },
    prcLink: {
        type: String,
        required: [true, "Please provide meeting link."]
    },
    prcWhatLink: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    disabledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    }
}, {timestamps: true});

const Practices = mongoose.models.Practices || mongoose.model('Practices', practiceSchema);
export default Practices;
