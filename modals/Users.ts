import mongoose from 'mongoose';
import validator from 'validator';
import Countries from './Countries';
import States from './States';

const usrSchema = new mongoose.Schema({
    sdkRegNo: { 
        type: String, 
    },
    sdkFstName: { 
        type: String, 
        required: [true, "First name is required."]
    },
    sdkMdlName: { 
        type: String, 
    },
    sdkLstName: { 
        type: String, 
        required: [true, "Last name is required."]
    },
    sdkFthName: { 
        type: String, 
    },
    sdkMthName: { 
        type: String, 
    },
    sdkAbout: { 
        type: String, 
    },
    sdkRefName:{
        type:String
    },
    sdkRefCont:{
        type:String
    },
    isEmailVerified:{
        type:Boolean
    },
    isPhoneVerified:{
        type:Boolean
    },
    isMedIssue: { 
        type: String,
    },
    sdkMedIssue: { 
        type: String,
    },
    sdkBthDate: { 
        type: Date, 
        required: [true, "DOB is required."]
    },
    sdkGender: { 
        type: String, 
        required: [true, "Gender is required."]
    },
    sdkMarStts: { 
        type: String, 
        required: [true, "Marital status is required."]
    },
    sdkSpouce: { 
        type: String, 
    },
    sdkPhone: { 
        type: String, 
        unique: true,
        required: [true, "Phone number is required."],
        validate: {
            validator: (v:any) => validator.isMobilePhone(v),
            message: 'Please enter a valid phone number.'
        }
    },
    sdkWhtNbr: { 
        type: String, 
        unique: true,
        required: [true, "WhatsApp number is required."],
        validate: {
            validator: (v:any) => validator.isMobilePhone(v),
            message: 'Please enter a valid WhatsApp number.'
        }
    },
    sdkEmail: { 
        type: String,
        lowercase: true,
        unique: true, 
        validate: [validator.isEmail, 'Please enter a valid email.'],
        required: [true, "Email is required."]
    },
    sdkEdc:{
        type:String
    },
    sdkOcp:{
        type:String
    },
    sdkCountry: { 
        type: String, 
        ref: Countries,
        required: [true, "Please select country."]
    },
    sdkState: { 
        type: String, 
        ref: States,
        required: [true, "Please select state."]
    },
    sdkCity: { 
        type: String, 
        required: [true, "Please select city."]
    },
    sdkPinCode:{
        type:Number
    },
    sdkComPinCode:{
        type:Number
    },
    sdkComAdds: { 
        type: String, 
        required: [true, "Communication address is must."]
    },
    sdkParAdds: { 
        type: String, 
        required: [true, "Parmanent address is must."]
    },
    sdkPwd: { 
        type: String, 
        minlength: [8, 'Password must be at least 8 characters long.'],
        runValidators: true,
        unique: false,
        required: [true, "Create password is required."]
    },
    sdkConfPwd: { 
        type: String, 
        minlength: [8, 'Confirm Password must be at least 8 characters long.'],
        runValidators: true,
        unique: false,
    },
    sdkImg: {
        type: String
    },
    sdkRole: {
        type: String,
        default: "Sadhak"
    },
    isVolunteer:{
        type:String,
        default: "No"
    },
    isAdmin:{
        type:String,
        default: "No"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    deletedBy: {
        type: String
    },
    disabledBy: {
        type: String
    },
    sdkCourseDone: [String],
    pwdResetToken: String,
    pwdResetTokenExpires: Date,
    sdkRegPwd:String,
    sdkRegPwdExpiry:Date
}, { timestamps: true });

const Users = mongoose.models.Users || mongoose.model('Users', usrSchema);
export default Users;
