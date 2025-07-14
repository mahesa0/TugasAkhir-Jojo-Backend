import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const {
    username,
    password,
    confPassword
  } = req.body;

  try {
    // Validasi username minimal 3 karakter
    if (!username || username.length < 3) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Nama pengguna harus minimal 3 karakter",
      });
    }

    // Validasi password minimal 6 karakter
    if (!password || password.length < 6) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Kata sandi harus minimal 6 karakter",
      });
    }

    // Cek apakah username sudah ada
    let user = await User.findOne({
      username
    });
    if (user) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: `Nama pengguna ${username} sudah ada`,
      });
    }

    // Cek konfirmasi password
    if (password !== confPassword) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Kata sandi tidak cocok",
      });
    }

    // Buat user baru
    user = new User({
      username,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Simpan user ke database
    await user.save();

    res.status(200).json({
      error: false,
      status: "200",
      message: "Pengguna berhasil terdaftar",
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({
        error: true,
        status: "500",
        message: "Server error"
      }); // Fixed typo: massage -> message
  }
};

export const login = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    let user = await User.findOne({
      username
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Nama pengguna salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "Kata sandi salah",
      });
    }

    const payload = {
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    };
    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({
        error: false,
        status: "200",
        message: "Masuk telah berhasil",
        token,
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      massage: "Server error",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findOne({
      username: req.params.username,
    }).select("-password");

    if (!users) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "Pengguna tidak ditemukan",
      });
    }
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");

    if (allUsers.length > 0) {
      return res.status(200).json({
        error: false,
        status: 200,
        data: allUsers,
      });
    } else if (allUsers.length === 0) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "Tidak ada pengguna ditemukan",
      });
    }
    res.json(allUsers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: `Nama pengguna ${username} tidak ditemukan`,
      });
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({
        username
      });
      if (usernameExists) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: `Nama pengguna ${username} sudah ada`,
        });
      }
      user.username = username;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({
      error: false,
      status: "200",
      message: `Pengguna ${user} berhasil di update`,
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      massage: "Server error",
    });
  }
};

export const updateById = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    username,
    password,
    role
  } = req.body;

  try {
    // Validasi ID
    if (!id) {
      return res.status(400).json({
        error: true,
        status: "400",
        message: "ID pengguna diperlukan",
      });
    }

    // Temukan user berdasarkan ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: "Pengguna tidak ditemukan",
      });
    }

    // Validasi username jika disediakan
    if (username) {
      if (username.length < 3) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: "Nama pengguna harus minimal 3 karakter",
        });
      }

      // Cek apakah username sudah digunakan oleh user lain
      const existingUser = await User.findOne({
        username,
        _id: {
          $ne: id
        }, // Exclude current user from check
      });

      if (existingUser) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: `Nama pengguna ${username} sudah digunakan oleh pengguna lain`,
        });
      }
    }

    // Validasi password jika disediakan
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: true,
          status: "400",
          message: "Kata sandi harus minimal 6 karakter",
        });
      }
    }

    // Update data pengguna
    user.username = username || user.username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.role = role || user.role;

    // Simpan perubahan
    const updatedUser = await user.save();

    // Hapus password dari respons untuk keamanan
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      error: false,
      status: "200",
      message: "Pengguna berhasil diperbarui",
      data: userResponse,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error", // Fixed typo: massage -> message
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    let user;

    try {
      user = await User.findById(req.user.id);
    } catch (findError) {
      return res.status(500).json({
        error: true,
        status: "500",
        massage: "Server error saat mencari user",
      });
    }

    if (!user) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: `Pengguna ${username} tidak ditemukan`,
      });
    }

    try {
      await user.deleteOne();
    } catch (removeError) {
      return res.status(500).json({
        error: true,
        status: "500",
        massage: "Server error saat menghapus user",
      });
    }

    res.status(200).json({
      error: false,
      status: "200",
      message: "Hapus profile berhasil",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      massage: "Server error",
    });
  }
};

export const deleteById = async (req, res) => {
  const {
    id
  } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        status: "404",
        message: `Pengguna ${username} tidak ditemukan`,
      });
    }

    await user.deleteOne();
    res.status(200).json({
      error: false,
      status: "200",
      data: {
        user
      },
      massage: `Pengguna berhasil dihapus`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: true,
      status: "500",
      massage: "Server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      error: false,
      status: "200",
      message: "Berhasil keluar"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: true,
      status: "500",
      message: "Server error"
    });
  }
};