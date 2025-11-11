// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

// Buat pembayaran baru (tidak perlu login)
router.post("/", paymentController.createPayment);

// Lihat daftar pembayaran (admin/kasir tetap butuh login)
router.get("/", verifyToken, paymentController.getPayments);

module.exports = router;
