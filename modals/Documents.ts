import mongoose from "mongoose";
import Users from "./Users";

const documentsSchema = new mongoose.Schema({
    sdkName:{
        type:String
    },
    sdkDocOwnr:{
        type:String
    },
    sdkUpldDate:{
        type:Date
    },
    sdkDocStatus:{
        type:String,
        default:'Pending'
    },
    sdkAprDate:{
        type:Date
    },
    sdkRemarks:{
        type:String
    },
    sdkDocRel:{
        type:String
    },
    sdkDocType:{
        type:String
    },
    sdkPan: {
        type: String,
    },
    sdkPanNbr: {
        type: String,
    },
    sdkIdProof: {
        type: String,
    },
    sdkIdNbr: {
        type: String,
    },
    sdkAdsProof: {
        type: String,
    },
    sdkAdsNbr: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default:true
    },
    usrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
},{timestamps: true});

const Documents = mongoose.models.Documents || mongoose.model('Documents', documentsSchema);
export default Documents;