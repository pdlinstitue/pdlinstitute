import mongoose from 'mongoose';
import Eventcat from './Eventcat';
import Users from './Users';

const eventSchema = new mongoose.Schema({
    eveName: { 
        type: String, 
    },
    eveCatId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:Eventcat 
    },
    eveImg: {
        type: String
    },
    eveStartAt: {
        type: String,
    },
    eveEndAt: {
        type: String,
    },
    eveMode: {
        type: String,
    },
    eveLink: {
        type: String,
    },
    eveLoc: {
        type: String,
    },
    eveType: {
        type: String,
    },
    eveShort: {
        type: String
    },
    eveDesc: {
        type: String
    },
    eveDate: {
        type: Date
    },
    eveAud: {
        type: String,
    },
    eveDon: {
        type: Number
    },
    eveSpeak: {
        type: String
    },
    evePer: {
        type: String
    },
    eveCont: {
        type: String
    },
    isActive: {
        type: Boolean,
        default:true
    },
    usrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    }
},{timestamps: true});

const Events = mongoose.models.Events || mongoose.model('Events', eventSchema);
export default Events;
