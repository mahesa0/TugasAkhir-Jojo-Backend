import mongoose from "mongoose";

const KriteriaSchema = new mongoose.Schema({
  kodeKriteria: {
    type: String,
    required: true,
    unique: true,
  },
  namaKriteria: {
    type: String,
    required: true,
    unique: true,
  },
  tipeKriteria: {
    type: String,
    required: true,
    enum: ["Benefit", "Cost"],
  },
  bobotKriteria: {
    type: Number,
    required: false,
    min: 0,
    max: 1,
  },
}, {
  timestamps: true,
});

const Kriteria = mongoose.model("Kriteria", KriteriaSchema);
export default Kriteria;