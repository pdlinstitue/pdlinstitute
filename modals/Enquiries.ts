import mongoose from 'mongoose';
import Users from './Users';
import validator from 'validator';

const enquiriesSchema = new mongoose.Schema({
    eqrMessage: { 
        type: String, 
        required:[true, "Please enter your message."]
    },
    eqrName:{
        type:String,
        required:[true, "Please provide your full name."]
    },
    eqrSub:{
        type:String,
        required:[true, "Subject is required."]
    },
    eqrEmail:{
        type:String,
        lowercase: true,
        unique: true, 
        validate: [validator.isEmail, 'Enter a valid email.'],
        required: [true, "Email is required."]
    },
    eqrPhone:{
        type:String,
        unique: true,
        required: [true, "Phone is required."],
        validate: {
            validator: (v:any) => validator.isMobilePhone(v),
            message: 'Enter a valid phone number.'
        }
    },
    isActive: {
        type: Boolean,
        default:true
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
    },
    disabledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
    }
},{timestamps: true});

const Enquiries =  mongoose.models.Enquiries || mongoose.model('Enquiries', enquiriesSchema);
export default Enquiries;