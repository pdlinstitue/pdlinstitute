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
    enrSrnShot: {
        type: String
    },   
    isApproved: {
        type: String,
        default:"Pending"
    },
    isCompleted: {
        type: Boolean,
        default:false
    },
    enrRemarks:{
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
    }
},{timestamps: true});

const Enrollments = mongoose.models.Enrollments || mongoose.model('Enrollments', enrollmentSchema);
export default Enrollments;
