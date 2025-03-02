import mongoose from "mongoose";

const citiesSchema = new mongoose.Schema({
    city_id: { type: Number },
    city_name: { type: String, required: true },
    state_id: { type: Number },
    state_name: { type: String },
    state_iso2: { type: Number },
    country_id: { type: Number },
    country_name: { type: String },
    country_iso2: { type: String },
    status: { type: Number }
  },{timestamps:true});

const Cities = mongoose.models.Cities || mongoose.model('Cities', citiesSchema);
export default Cities;