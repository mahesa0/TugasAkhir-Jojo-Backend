import mongoose from "mongoose";

const NilaiKriteriaSchema = new mongoose.Schema({
    kode: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, {
    _id: false
});

const PerhitunganSchema = new mongoose.Schema({
    alternatif: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alternatif",
        required: true,
        unique: true
    },
    keterangan: {
        type: String,
        required: true
    },
    nilai: {
        type: [NilaiKriteriaSchema],
        required: true
    },
}, {
    timestamps: true
});

const Perhitungan = mongoose.model("Perhitungan", PerhitunganSchema);
export default Perhitungan;