import mongoose from 'mongoose';
import Users from './Users';

const sidemenuesSchema = new mongoose.Schema({
  menuOrder:{
    type: Number,
    default: 1
  },
  menuName: { 
    type: String,
  },
  menuIcon: { 
    type: String,
  },
  menuUrl: { 
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isParent: {
    type: Boolean,
  },
  isChild: {
    type: Boolean,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
  },
  disabledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
  },
}, { timestamps: true });

const Sidemenues = mongoose.models.Sidemenues || mongoose.model('Sidemenues', sidemenuesSchema);
export default Sidemenues;