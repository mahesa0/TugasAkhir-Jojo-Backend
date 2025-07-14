import Alternatif from "../models/AlternatifModel.js";

// Create Alternatif
export const createAlternatif = async (req, res) => {
  const {
    Kode,
    Keterangan,
  } = req.body;

  try {
    // Validasi input
    if (!Kode || !Keterangan) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Semua field harus diisi",
      });
    }

    // Cek apakah kode sudah ada
    const existingKode = await Alternatif.findOne({
      Kode
    });
    if (existingKode) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: `Kode ${Kode} sudah ada`,
      });
    }

    // Cek apakah keterangan sudah ada
    const existingKeterangan = await Alternatif.findOne({
      Keterangan
    });
    if (existingKeterangan) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: `Keterangan ${Keterangan} sudah ada`,
      });
    }

    // Buat alternatif baru
    const alternatif = new Alternatif({
      Kode,
      Keterangan,
    });

    // Simpan ke database
    await alternatif.save();

    res.status(201).json({
      error: false,
      status: "201",
      message: "Alternatif berhasil ditambahkan",
      data: alternatif,
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

// Get Alternatif by Kode
export const getAlternatif = async (req, res) => {
  try {
    const alternatif = await Alternatif.findOne({
      Kode: req.params.Kode,
    });

    if (!alternatif) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Alternatif tidak ditemukan",
      });
    }

    res.status(200).json({
      error: false,
      status: "200",
      data: alternatif,
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

// Get All Alternatif
export const getAllAlternatif = async (req, res) => {
  try {
    const alternatif = await Alternatif.find();

    if (alternatif.length === 0) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Tidak ada alternatif ditemukan",
      });
    }

    res.status(200).json({
      error: false,
      status: "200",
      data: alternatif,
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

// Update Alternatif
export const updateAlternatif = async (req, res) => {
  const {
    Kode,
    Keterangan
  } = req.body;

  try {
    // Cari alternatif berdasarkan kode
    let alternatif = await Alternatif.findOne({
      Kode: req.params.Kode,
    });

    if (!alternatif) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Alternatif tidak ditemukan",
      });
    }

    // Validasi kode baru jika diubah
    if (Kode && Kode !== req.params.Kode) {
      const existingKode = await Alternatif.findOne({
        Kode
      });
      if (existingKode) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: `Kode ${Kode} sudah ada`,
        });
      }
    }

    // Validasi keterangan baru jika diubah
    if (Keterangan && Keterangan !== alternatif.Keterangan) {
      const existingKeterangan = await Alternatif.findOne({
        Keterangan
      });
      if (existingKeterangan) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: `Keterangan ${Keterangan} sudah ada`,
        });
      }
    }

    // Update data
    alternatif.Kode = Kode || alternatif.Kode;
    alternatif.Keterangan = Keterangan || alternatif.Keterangan;

    // Simpan perubahan
    await alternatif.save();

    res.status(200).json({
      error: false,
      status: "200",
      message: "Alternatif berhasil diperbarui",
      data: alternatif,
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

// Delete Alternatif
export const deleteAlternatif = async (req, res) => {
  try {
    const alternatif = await Alternatif.findOne({
      Kode: req.params.Kode,
    });

    if (!alternatif) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Alternatif tidak ditemukan",
      });
    }

    await alternatif.deleteOne();

    res.status(200).json({
      error: false,
      status: "200",
      message: "Alternatif berhasil dihapus",
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