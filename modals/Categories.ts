import mongoose from 'mongoose';

const catSchema = new mongoose.Schema({
    catName: { 
        type: String, 
        required:[true, "Category name is required."]
    },
    catImage:{
        type:String
    },
    isActive: {
        type: Boolean,
        default:true
    }
},{timestamps: true});

const Categories =  mongoose.models.Categories || mongoose.model('Categories', catSchema);
export default Categories;