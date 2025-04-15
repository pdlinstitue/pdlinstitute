import mongoose from "mongoose";

const volSchema = new mongoose.Schema({
    volName: {
        type : String
    }
},{timestamps: true});
const Volunteers = mongoose.models.Volunteers || mongoose.model('Volunteers', volSchema);
export default Volunteers;