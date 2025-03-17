import mongoose from "mongoose";
import Courses from "./Courses";
import Users from "./Users";
  
const couponsSchema = new mongoose.Schema({
    cpnName: {
        type: String
    },
    cpnUse: {
        type: Number
    },
    cpnVal:{
        type: Number
    },
    cpnDisType: {
        type:String
    },
    cpnDisc: {
        type: Number,
     },
    cpnCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses
     },
    cpnFor: {
        type: String,
    },
    cpnSdk: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    }, 
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    },  
}, {timestamps: true});

const Coupons = mongoose.models.Coupons || mongoose.model('Coupons', couponsSchema);
export default Coupons;
