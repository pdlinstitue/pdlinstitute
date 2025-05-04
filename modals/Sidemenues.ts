import mongoose from 'mongoose';
import Users from './Users';

const sidemenuesSchema = new mongoose.Schema({
    menuName: { 
        type: String, 
        unique: true,
    },
    menuIcon: { 
        type: String, 
        unique: true,
    },
    menuUrl: { 
        type: String, 
        unique: true,
    },
    isActive: {
        type: Boolean,
        default:true
    },
    isParent:{
        type: Boolean,
    },
    isChild:{
        type: Boolean,
    },
	parentId: {
        type: mongoose.Schema.Types.ObjectId,
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

const Sidemenues =  mongoose.models.Sidemenues || mongoose.model('Sidemenues', sidemenuesSchema);
export default Sidemenues;