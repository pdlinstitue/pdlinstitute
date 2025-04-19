import mongoose from 'mongoose';
import Users from './Users';
import Courses from './Courses';


const reenrollmentsSchema = new mongoose.Schema({   
    corId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Courses,
    },
    reqBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users,
    },   
    reqReason:{
        type:String,
        required:[true, "Please provide reason."]
    },
    reqStatus:{
        type:String,
        default:"Pending",
    },
    isActive: {
        type: Boolean,
        default:true
    },
    isDeleted:{
        type: Boolean,
        default:false
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

const Reenrollments = mongoose.models.Reenrollments || mongoose.model('Reenrollments', reenrollmentsSchema);
export default Reenrollments;
