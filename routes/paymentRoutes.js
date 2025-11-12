// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getAllPayments,
  createPayment,
  getMyPayments,
} = require("../controllers/paymentController");

// ================================
// 💳 Ambil Semua Pembayaran
// ================================
router.get("/", verifyToken, getAllPayments);

// ================================
// 💵 Tambah Pembayaran Baru
// ================================
router.post("/", verifyToken, createPayment);

// ================================
// 👤 Ambil Pembayaran User
// ================================
router.get("/my", verifyToken, getMyPayments);

module.exports = router;
