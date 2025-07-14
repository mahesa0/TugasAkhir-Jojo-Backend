import mongoose from "mongoose";

const AlternatifSchema = new mongoose.Schema({
  Kode: {
    type: String,
    required: true,
    unique: true,
  },
  Keterangan: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const Alternatif = mongoose.model("Alternatif", AlternatifSchema);
export default Alternatif;