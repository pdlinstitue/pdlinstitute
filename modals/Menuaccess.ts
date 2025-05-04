import mongoose from 'mongoose';
import Users from './Users';
import Roles from './Roles';
import Sidemenues from './Sidemenues';

const menuaccessSchema = new mongoose.Schema({
    roleId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: Roles 
    },
    menuId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Sidemenues,
        }
    ],
    isActive: {
        type: Boolean,
        default:true
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
    }
},{timestamps: true});

const Menuaccess =  mongoose.models.Menuaccess || mongoose.model('Menuaccess', menuaccessSchema);
export default Menuaccess;