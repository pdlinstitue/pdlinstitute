import mongoose from "mongoose";
import Users from "./Users";

const modulesSchema = new mongoose.Schema(
  {
    modName: {
      type: String,
      required: [true, "Module name is required."],
    },
    modActions:[
      {
        name: {
          type: String,
          required: [true, "Action name is required."],
        },
        url: {
          type: String,
          required: [true, "Action URL is required."],
        },
      },
    ],
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
