import mongoose from 'mongoose';

const usrSchema = new mongoose.Schema({
    catName: { 
        type: String, 
        required:[true, "Category name is required."]
    },
    catImage:{
        type:String
    },
    isActive: {
        type: Boolean,
        default:false
    }
},{timestamps: true});

const Users =  mongoose.models.Users || mongoose.model('Users', usrSchema);
export default Users;