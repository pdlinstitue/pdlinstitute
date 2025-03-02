import mongoose from 'mongoose';
import Users from './Users';
import Courses from './Courses';

const prospectsSchema = new mongoose.Schema({   
    prosMonth:{
        type:String
    },
    prosShift:{
        type:String
    },   
    isActive: {
        type: Boolean,
        default:true
    },
    corId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Courses
    },
    usrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    }
},{timestamps: true});

const Prospects = mongoose.models.Prospects || mongoose.model('Prospects', prospectsSchema);
export default Prospects;
