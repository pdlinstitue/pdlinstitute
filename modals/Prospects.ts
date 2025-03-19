import mongoose from 'mongoose';
import Users from './Users';
import Courses from './Courses';

const prospectsSchema = new mongoose.Schema({   
    prosMonth:{
        type:String,
        required:[true, "Please select month."]
    },
    prosShift:{
        type:String,
        required:[true, "Please select shift."]
    },   
    prosWeek:{
        type:Number,
        required:[true, "Please enter week"]
    },
    prosOptMonth:{
        type:String,
    },
    prosOptShift:{
        type:String,
    },   
    prosOptWeek:{
        type:Number,
    },
    isActive: {
        type: Boolean,
        default:true
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    corId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses
    },
    sdkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    disabledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    }
},{timestamps: true});

const Prospects = mongoose.models.Prospects || mongoose.model('Prospects', prospectsSchema);
export default Prospects;
