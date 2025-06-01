import mongoose from 'mongoose';
import Users from './Users';
import Modules from './Modules';
import Roles from './Roles';

const permissionsSchema = new mongoose.Schema({    
    rolId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Roles,
        required:[true, "Role ID is required."],
    },
    modId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Modules,
        required:[true, "Module ID is required."],
    },
    modAtnIds:{
        type:[mongoose.Schema.Types.ObjectId],
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

const Permissions =  mongoose.models.Permissions || mongoose.model('Permissions', permissionsSchema);
export default Permissions;