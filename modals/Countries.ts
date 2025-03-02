import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    country_id: { type: Number },
    country_name: { type: String, required: true },
    country_iso3: { type: String },
    country_iso2: { type: String },
    country_phonecode: { type: String },
    country_capital: { type: String },
    currency_code: { type: String },
    currency_name: { type: String },
    currency_symbol: { type: String },
    region: { type: String },
    region_id: { type: Number },
    subregion: { type: String },
    subregion_id: { type: Number },
    nationality: { type: String },
    country_flag: { type: String },
    zoneName: { type: String },
    GMToffsetName: { type: String },
    tziso3: { type: String },
    tzName: { type: String },
    status: { type: Number },
  }, {timestamps: true});

 const Countries = mongoose.models.Countries || mongoose.model('Countries', countrySchema);
 export default Countries;