import mongoose from 'mongoose';

const usrSchema = new mongoose.Schema({
    sdkName: { 
        type: String, 
    },
    sdkImg:{
        type:String
    },
    sdkRole:{
        type:String,
        default:"Sadhak"
    },
    isActive: {
        type: Boolean,
        default:false
    }
},{timestamps: true});

const Users =  mongoose.models.Users || mongoose.model('Users', usrSchema);
export default Users;