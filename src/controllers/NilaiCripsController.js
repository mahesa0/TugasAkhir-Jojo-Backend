import Crips from "../models/NilaiCrips.js";

// Create Crips
export const createCrips = async (req, res) => {
    const {
        namaKriteria,
        nilai,
        Bobot
    } = req.body;
    try {
        if (!namaKriteria || !Array.isArray(nilai) || nilai.length === 0 || !Array.isArray(Bobot) || Bobot.length === 0) {
            return res.status(400).json({
                error: true,
                status: "400",
                message: "Semua field harus diisi dan nilai serta bobot harus berupa array minimal 1 data",
            });
        }
        if (nilai.length !== Bobot.length) {
            return res.status(400).json({
                error: true,
                status: "400",
                message: "Jumlah nilai dan bobot harus sama dan sejajar",
            });
        }
        // Validasi setiap nilai
        for (let n of nilai) {
            if (n.min !== undefined && typeof n.min !== 'number') {
                return res.status(400).json({
                    error: true,
                    status: "400",
                    message: "min pada nilai harus berupa number jika diisi",
                });
            }
            if (n.max !== undefined && typeof n.max !== 'number') {
                return res.status(400).json({
                    error: true,
                    status: "400",
                    message: "max pada nilai harus berupa number jika diisi",
                });
            }
        }
        // Cek unik namaKriteria
        const existingCrips = await Crips.findOne({
            namaKriteria
        });
        if (existingCrips) {
            return res.status(400).json({
                error: true,
                status: "400",
                message: "Data crips dengan kriteria tersebut sudah ada",
            });
        }
        const crips = new Crips({
            namaKriteria,
            nilai,
            Bobot
        });
        await crips.save();
        res.status(201).json({
            error: false,
            status: "201",
            message: "Data crips berhasil ditambahkan",
            data: crips,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: true,
            status: "500",
            message: "Terjadi kesalahan server",
        });
    }
};

// Get All Crips
export const getAllCrips = async (req, res) => {
    try {
        const crips = await Crips.find();
        if (crips.length === 0) {
            return res.status(404).json({
                error: true,
                status: "404",
                message: "Tidak ada data crips ditemukan",
            });
        }
        res.status(200).json({
            error: false,
            status: "200",
            data: crips,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: true,
            status: "500",
            message: "Terjadi kesalahan server",
        });
    }
};

// Get Crips by ID
export const getCripsById = async (req, res) => {
    try {
        const crips = await Crips.findById(req.params.id);
        if (!crips) {
            return res.status(404).json({
                error: true,
                status: "404",
                message: "Data crips tidak ditemukan",
            });
        }
        res.status(200).json({
            error: false,
            status: "200",
            data: crips,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: true,
            status: "500",
            message: "Terjadi kesalahan server",
        });
    }
};

// Update Crips
export const updateCrips = async (req, res) => {
    const {
        namaKriteria,
        nilai,
        Bobot
    } = req.body;
    try {
        const crips = await Crips.findById(req.params.id);
        if (!crips) {
            return res.status(404).json({
                error: true,
                status: "404",
                message: "Data crips tidak ditemukan",
            });
        }
        // Cek unik namaKriteria jika diubah
        if (namaKriteria && namaKriteria !== crips.namaKriteria) {
            const existingCrips = await Crips.findOne({
                namaKriteria
            });
            if (existingCrips && existingCrips._id.toString() !== crips._id.toString()) {
                return res.status(400).json({
                    error: true,
                    status: "400",
                    message: "Data crips dengan kriteria tersebut sudah ada",
                });
            }
        }
        if (nilai) {
            if (!Array.isArray(nilai) || nilai.length === 0) {
                return res.status(400).json({
                    error: true,
                    status: "400",
                    message: "Nilai harus berupa array minimal 1 data",
                });
            }
            for (let n of nilai) {
                if (n.min !== undefined && typeof n.min !== 'number') {
                    return res.status(400).json({
                        error: true,
                        status: "400",
                        message: "min pada nilai harus berupa number jika diisi",
                    });
                }
                if (n.max !== undefined && typeof n.max !== 'number') {
                    return res.status(400).json({
                        error: true,
                        status: "400",
                        message: "max pada nilai harus berupa number jika diisi",
                    });
                }
            }
        }
        if (Bobot && (!Array.isArray(Bobot) || Bobot.length === 0)) {
            return res.status(400).json({
                error: true,
                status: "400",
                message: "Bobot harus berupa array minimal 1 data",
            });
        }
        if ((nilai && Bobot) && (nilai.length !== Bobot.length)) {
            return res.status(400).json({
                error: true,
                status: "400",
                message: "Jumlah nilai dan bobot harus sama dan sejajar",
            });
        }
        crips.namaKriteria = namaKriteria || crips.namaKriteria;
        crips.nilai = nilai || crips.nilai;
        crips.Bobot = Bobot || crips.Bobot;
        await crips.save();
        res.status(200).json({
            error: false,
            status: "200",
            message: "Data crips berhasil diperbarui",
            data: crips,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: true,
            status: "500",
            message: "Terjadi kesalahan server",
        });
    }
};

// Delete Crips
export const deleteCrips = async (req, res) => {
    try {
        await Crips.findByIdAndDelete(req.params.id);
        res.status(200).json({
            error: false,
            status: "200",
            message: "Data crips berhasil dihapus",
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: true,
            status: "500",
            message: "Terjadi kesalahan server",
        });
    }
};