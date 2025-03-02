import mongoose from 'mongoose';
import Categories from './Categories';
import Users from './Users';

const courseSchema = new mongoose.Schema({
    coName: { 
        type: String, 
        required: [true, "Course name is required."]
    },
    coNick: { 
        type: String, 
        required: [true, "Nick name is required."]
    },
    coImg: {
        type: String
    },
    durDays: {
        type: Number,
        required: [true, "Duration is must."]
    },
    durHrs: {
        type: Number,
        required: [true, "Hour is must."]
    },
    coCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Categories,
        required: [true, "Please choose category."]
    },
    coElgType: {
        type: String,
        required: [true, "Please choose eligibility type."]
    },
    coElg: {
        type: String,
        required: [true, "Please choose eligibility."]
    },
    coShort: {
        type: String,
        required: [true, "Course introduction is must."]
    },
    coDesc: {
        type: String
    },
    coWhatGrp: {
        type: String
    },
    coTeleGrp: {
        type: String
    },
    coType: {
        type: String,
        required: [true, "Please choose course type."]
    },
    coDon: {
        type: Number
    },
    prodType: {
        type: String
    },
    isActive: {
        type: Boolean,
        default:true
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
    }
},{timestamps: true});

const Courses = mongoose.models.Courses || mongoose.model('Courses', courseSchema);
export default Courses;
