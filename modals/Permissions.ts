import mongoose from 'mongoose';
import Users from './Users';
import Modules from './Modules';
import Roles from './Roles';

const permissionsSchema = new mongoose.Schema({
    atnId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Modules,
        required:[true, "Action ID is required."],
    },
    rolId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Roles,
        required:[true, "Role ID is required."],
    },
    isListEnabled:{
        type:Boolean,
        default:false
    },
    isViewEnabled:{
        type:Boolean,
        default:false
    },
    isAddEnabled:{
        type:Boolean,
        default:false
    },
    isEditEnabled:{
        type:Boolean,
        default:false
    },
    isRegPwdEnabled:{
        type:Boolean,
        default:false
    },
    isEnbEnabled:{
        type:Boolean,
        default:false
    },
    isDisEnabled:{
        type:Boolean,
        default:false
    },
    isDelEnabled:{
        type:Boolean,
        default:false
    },
    isMarkEnabled:{
        type:Boolean,
        default:false
    },
    isAttdeesEnabled:{
        type:Boolean,
        default:false
    },
    isAttdImgEnabled:{
        type:Boolean,
        default:false
    },
    isAmendEnabled:{
        type:Boolean,
        default:false
    },
    isCompEnabled:{
        type:Boolean,
        default:false
    },
    isApvEnrEnabled:{
        type:Boolean,
        default:false
    },
    isMnlEnrEnabled:{
        type:Boolean,
        default:false
    },
    isAvpDocEnabled:{
        type:Boolean,
        default:false
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