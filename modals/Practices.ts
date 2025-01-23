import mongoose from "mongoose";
  
const practiceSchema = new mongoose.Schema({
    prcName: {
        type: String
    },
    prcImg: {
        type: String
    },
    prcLang:{
        type: String
    },
    prcDays: [String],
    prcStartsAt: {
        type: String,
    },
    prcEndsAt: {
        type: String,
     },
    prcLink: {
        type: String,
    },
    prcWhatLink: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },  
}, {timestamps: true});

const Practices = mongoose.models.Practices || mongoose.model('Practices', practiceSchema);
export default Practices;
