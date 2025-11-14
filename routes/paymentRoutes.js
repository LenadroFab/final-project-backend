const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  createPayment,
  getMyPayments,
} = require("../controllers/paymentController");

const { verifyToken } = require("../middleware/authMiddleware");

// Ambil semua pembayaran (ADMIN)
router.get("/", verifyToken, getAllPayments);

// Buat pembayaran
router.post("/", verifyToken, createPayment);

// Pembayaran milik user login
router.get("/my", verifyToken, getMyPayments);

module.exports = router;
