import mongoose from 'mongoose';
import Users from './Users';
import Courses from './Courses';
import Batches from './Batches';

const enrollmentSchema = new mongoose.Schema({
    enrBthName: { 
        type: String, 
    },
    enrTnsNo: {
        type: String
    },
    cpnName: {
        type: String
    },
    enrSrnShot: {
        type: String
    },   
    isApproved: {
        type: String,
        default:"Pending"
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isCompleted: {
        type: String,
        default:"Pending"
    },
    enrPaymentStatus:{
        type:String,
    },
    enrRemarks:{
        type: String
    },
    enrIncompRemarks:{
        type: String
    },
    corId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses
    },
    bthId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Batches
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

const Enrollments = mongoose.models.Enrollments || mongoose.model('Enrollments', enrollmentSchema);
export default Enrollments;
