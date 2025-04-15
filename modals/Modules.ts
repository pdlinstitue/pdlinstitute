import mongoose from "mongoose";
import Users from "./Users";

const modulesSchema = new mongoose.Schema(
  {
    atnName: {
      type: String,
      required: [true, "Action name is required."],
    },
    listUrl: {
      type: String,
    },
    addUrl: {
      type: String,
    },
    viewUrl: {
      type: String,
    },
    editUrl: {
      type: String,
    },
    enableUrl: {
      type: String,
    },
    disableUrl: {
      type: String,
    },
    deleteUrl: {
      type: String,
    },
    attdeesUrl:{
      type:String
    },
    attdImgUrl:{
      type:String
    },
    markUrl: {
      type: String,
    },
    amendUrl: {
      type: String,
    },
    regPwdUrl: {
      type: String,
    },
    compUrl: {
      type: String,
    },
    apvEnrUrl: {
      type: String,
    },
    mnlEnrUrl: {
      type: String,
    },
    apvDocUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Users,
    },
  },
  { timestamps: true }
);

const Modules = mongoose.models.Modules || mongoose.model("Modules", modulesSchema);
export default Modules;
