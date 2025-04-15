import mongoose from 'mongoose';
import Users from './Users';

const roleSchema = new mongoose.Schema({
    roleType: { 
        type: String, 
        unique: true,
        required: [true, "Role type is required."],
    },
    isActive: {
        type: Boolean,
        default:true
    },
    isDeleted:{
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

const Roles =  mongoose.models.Roles || mongoose.model('Roles', roleSchema);
export default Roles;