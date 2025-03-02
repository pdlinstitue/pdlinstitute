import mongoose from "mongoose";

const statesSchema = new mongoose.Schema({
    state_id: { type: Number },
    state_name: { type: String, required: true },
    state_iso2: { type: String },
    country_id: { type: Number },
    country_name: { type: String },
    country_iso2: { type: String },
    country_iso3: { type: String },
    status: { type: Number },
},{timestamps: true});

const States = mongoose.models.States || mongoose.model('States', statesSchema);
export default States;