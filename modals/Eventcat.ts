import mongoose from 'mongoose';
import Users from './Users';

const eventcatSchema = new mongoose.Schema({
    eveCatName: { 
        type: String, 
    },
    eveCatImg:{
        type:String
    },
    isActive: {
        type: Boolean,
        default:true
    },
    usrId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users
    }
},{timestamps: true});

const Eventcat =  mongoose.models.Eventcat || mongoose.model('Eventcat', eventcatSchema);
export default Eventcat;