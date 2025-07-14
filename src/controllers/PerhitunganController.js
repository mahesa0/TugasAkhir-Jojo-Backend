import Perhitungan from "../models/PerhitunganModel.js";
import Alternatif from "../models/AlternatifModel.js";
import Kriteria from "../models/KriteriaModel.js";

// Bulk input/update nilai perhitungan per siswa
export const bulkUpsertPerhitungan = async (req, res) => {
    const data = req.body;
    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({
            error: true,
            message: "Data harus berupa array dan tidak boleh kosong"
        });
    }
    try {
        // Cek duplikat keterangan selain milik alternatif yang sama
        for (const item of data) {
            // Cek jika sudah ada data perhitungan untuk alternatif ini
            const existingPerhitungan = await Perhitungan.findOne({
                alternatif: item.alternatif
            });
            if (existingPerhitungan) {
                return res.status(400).json({
                    error: true,
                    message: `Data perhitungan untuk alternatif ini sudah ada. Tidak boleh update pada halaman ini.`
                });
            }
            // Cek duplikat keterangan selain milik alternatif yang sama
            const existing = await Perhitungan.findOne({
                keterangan: item.keterangan,
                alternatif: {
                    $ne: item.alternatif
                }
            });
            if (existing) {
                return res.status(400).json({
                    error: true,
                    message: `Keterangan/nama '${item.keterangan}' sudah digunakan oleh alternatif lain.`
                });
            }
        }
        const bulkOps = data.map(item => ({
            updateOne: {
                filter: {
                    alternatif: item.alternatif
                },
                update: {
                    $set: {
                        keterangan: item.keterangan,
                        nilai: item.nilai
                    }
                },
                upsert: true
            }
        }));
        await Perhitungan.bulkWrite(bulkOps);
        res.status(200).json({
            error: false,
            message: "Data perhitungan berhasil disimpan"
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

// Get semua nilai perhitungan
export const getAllPerhitungan = async (req, res) => {
    try {
        const data = await Perhitungan.find().populate({
            path: "alternatif",
            select: "Keterangan"
        });
        res.status(200).json({
            error: false,
            data
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

// Hapus satu nilai perhitungan
export const deletePerhitungan = async (req, res) => {
    try {
        await Perhitungan.findByIdAndDelete(req.params.id);
        res.status(200).json({
            error: false,
            message: "Data berhasil dihapus"
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

// Update data perhitungan
export const updatePerhitungan = async (req, res) => {
    const {
        keterangan,
        nilai
    } = req.body;
    const {
        id
    } = req.params;
    try {
        // Cek duplikat keterangan selain milik dokumen yang sedang diupdate
        const existing = await Perhitungan.findOne({
            keterangan,
            _id: {
                $ne: id
            }
        });
        if (existing) {
            return res.status(400).json({
                error: true,
                message: `Keterangan/nama '${keterangan}' sudah digunakan oleh alternatif lain.`
            });
        }
        const updated = await Perhitungan.findByIdAndUpdate(
            id, {
                $set: {
                    keterangan,
                    nilai
                }
            }, {
                new: true,
                runValidators: true
            }
        );
        if (!updated) {
            return res.status(404).json({
                error: true,
                message: "Data tidak ditemukan"
            });
        }
        res.status(200).json({
            error: false,
            message: "Data berhasil diupdate",
            data: updated
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};