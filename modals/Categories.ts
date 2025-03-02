import mongoose from 'mongoose';
import Users from './Users';

const catSchema = new mongoose.Schema({
    catName: { 
        type: String, 
        required:[true, "Category name is required."]
    },
    catImg:{
        type:String
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

const Categories =  mongoose.models.Categories || mongoose.model('Categories', catSchema);
export default Categories;