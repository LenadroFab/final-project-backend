const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ============================
// 👥 GET semua user
// ============================
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "role"], // ambil kolom penting
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Gagal mengambil users:", err);
    res.status(500).json({ message: "Gagal mengambil users" });
  }
});

// ============================
// ➕ CREATE user baru
// ============================
router.post("/", async (req, res) => {
  try {
    const { username, password = "default123", role = "customer" } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username wajib diisi" });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashed, role });
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (err) {
    console.error("❌ Gagal membuat user:", err);
    res.status(500).json({ message: "Gagal membuat user" });
  }
});

// ============================
// ✏️ UPDATE user
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (username) user.username = username;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Gagal memperbarui user:", err);
    res.status(500).json({ message: "Gagal memperbarui user" });
  }
});

// ============================
// 🗑️ DELETE user
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // ✅ Coba hapus manual lewat Sequelize
    await user.destroy({
      force: true, // pastikan hard delete
    });

    return res.json({ message: "✅ User berhasil dihapus!" });
  } catch (err) {
    console.error("❌ Gagal menghapus user:", err);

    // Tampilkan error asli dari PostgreSQL agar tahu detailnya
    return res.status(500).json({
      message: err.message || "Gagal menghapus user!",
      error: err.parent || err,
    });
  }
});

module.exports = router;
