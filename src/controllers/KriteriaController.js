import Kriteria from "../models/KriteriaModel.js";

// Create Kriteria
export const createKriteria = async (req, res) => {
  const {
    kodeKriteria,
    namaKriteria,
    tipeKriteria,
    bobotKriteria
  } = req.body;

  try {
    // Validasi input dasar
    if (!kodeKriteria || !namaKriteria || !tipeKriteria) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Kode kriteria, nama kriteria, dan tipe kriteria harus diisi",
      });
    }

    // Validasi tipe kriteria (Benefit/Cost)
    if (tipeKriteria !== "Benefit" && tipeKriteria !== "Cost") {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Tipe kriteria harus 'Benefit' atau 'Cost'",
      });
    }

    // Validasi bobot kriteria (0-1)
    if (bobotKriteria !== undefined && (typeof bobotKriteria !== "number" || bobotKriteria < 0 || bobotKriteria > 1)) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Bobot kriteria harus berupa angka di antara 0 dan 1",
      });
    }

    // Cek apakah kode kriteria sudah ada
    const existingKode = await Kriteria.findOne({
      kodeKriteria
    });
    if (existingKode) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: `Kode kriteria ${kodeKriteria} sudah ada`,
      });
    }

    // Cek apakah nama kriteria sudah ada
    const existingNama = await Kriteria.findOne({
      namaKriteria
    });
    if (existingNama) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: `Nama kriteria ${namaKriteria} sudah ada`,
      });
    }

    // Buat kriteria baru
    const kriteria = new Kriteria({
      kodeKriteria,
      namaKriteria,
      tipeKriteria,
      bobotKriteria,
    });

    // Simpan ke database
    await kriteria.save();

    res.status(201).json({
      error: false,
      status: "201",
      message: "Kriteria berhasil ditambahkan",
      data: kriteria,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error",
    });
  }
};

// Get Kriteria by ID
export const getKriteria = async (req, res) => {
  try {
    const kriteria = await Kriteria.findById(req.params.id);

    if (!kriteria) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Kriteria tidak ditemukan",
      });
    }

    res.status(200).json({
      error: false,
      status: "200",
      data: kriteria,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error",
    });
  }
};

// Get All Kriteria
export const getAllKriteria = async (req, res) => {
  try {
    const kriteria = await Kriteria.find();

    if (kriteria.length === 0) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Tidak ada kriteria ditemukan",
      });
    }

    res.status(200).json({
      error: false,
      status: "200",
      data: kriteria,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error",
    });
  }
};

// Update Kriteria
export const updateKriteria = async (req, res) => {
  const {
    kodeKriteria,
    namaKriteria,
    tipeKriteria,
    bobotKriteria
  } = req.body;
  const {
    id
  } = req.params;

  try {
    console.log('Update Kriteria Request:', {
      id,
      body: req.body
    });

    // Validasi ID
    if (!id) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "ID kriteria tidak ditemukan",
      });
    }

    // Validasi input dasar
    if (!kodeKriteria && !namaKriteria && !tipeKriteria && bobotKriteria === undefined) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Tidak ada data yang diupdate",
      });
    }

    // Cari kriteria berdasarkan ID
    let kriteria = await Kriteria.findById(id);
    console.log('Kriteria ditemukan:', kriteria);

    if (!kriteria) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Kriteria tidak ditemukan",
      });
    }

    // Validasi tipe kriteria jika diubah
    if (tipeKriteria && tipeKriteria !== "Benefit" && tipeKriteria !== "Cost") {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Tipe kriteria harus 'Benefit' atau 'Cost'",
      });
    }

    // Validasi bobot kriteria jika diubah (0-1)
    if (bobotKriteria !== undefined && (typeof bobotKriteria !== "number" || bobotKriteria < 0 || bobotKriteria > 1)) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Bobot kriteria harus berupa angka di antara 0 dan 1",
      });
    }

    // Cek duplikasi kode kriteria jika kodeKriteria diubah
    if (kodeKriteria && kodeKriteria !== kriteria.kodeKriteria) {
      const existingKode = await Kriteria.findOne({
        kodeKriteria
      });
      if (existingKode) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: `Kode kriteria ${kodeKriteria} sudah ada`,
        });
      }
    }

    // Cek duplikasi nama kriteria jika namaKriteria diubah
    if (namaKriteria && namaKriteria !== kriteria.namaKriteria) {
      const existingNama = await Kriteria.findOne({
        namaKriteria
      });
      if (existingNama) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: `Nama kriteria ${namaKriteria} sudah ada`,
        });
      }
    }

    // Update data
    const updateData = {};
    if (kodeKriteria) updateData.kodeKriteria = kodeKriteria;
    if (namaKriteria) updateData.namaKriteria = namaKriteria;
    if (tipeKriteria) updateData.tipeKriteria = tipeKriteria;
    if (bobotKriteria !== undefined) updateData.bobotKriteria = bobotKriteria;

    console.log('Data yang akan diupdate:', updateData);

    // Update dan simpan perubahan
    const updatedKriteria = await Kriteria.findByIdAndUpdate(
      id,
      updateData, {
        new: true,
        runValidators: true
      }
    );

    console.log('Kriteria setelah diupdate:', updatedKriteria);

    res.status(200).json({
      error: false,
      status: "200",
      message: "Kriteria berhasil diperbarui",
      data: updatedKriteria,
    });
  } catch (err) {
    console.error('Error updating kriteria:', err);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error: " + err.message,
    });
  }
};

// Delete Kriteria
export const deleteKriteria = async (req, res) => {
  try {
    const kriteria = await Kriteria.findById(req.params.id);

    if (!kriteria) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Kriteria tidak ditemukan",
      });
    }

    await kriteria.deleteOne();

    res.status(200).json({
      error: false,
      status: "200",
      message: "Kriteria berhasil dihapus",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error",
    });
  }
};