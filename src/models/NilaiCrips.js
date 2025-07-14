import mongoose from "mongoose";

const NilaiRangeSchema = new mongoose.Schema({
    min: {
        type: Number
    },
    max: {
        type: Number
    }
}, {
    _id: false
});

const CripsSchema = new mongoose.Schema({
    namaKriteria: {
        type: String,
        required: true,
        unique: true,
    },
    nilai: {
        type: [NilaiRangeSchema],
        required: true,
    },
    Bobot: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
});

const Crips = mongoose.model("Crips", CripsSchema);
export default Crips;