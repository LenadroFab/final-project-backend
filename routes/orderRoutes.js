const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const { verifyToken } = require("../middleware/authMiddleware");

// Semua pesanan (ADMIN)
router.get("/", verifyToken, getAllOrders);

// Pesanan milik user yang login
router.get("/my", verifyToken, getMyOrders);

// Buat pesanan
router.post("/", verifyToken, createOrder);

// Update pesanan
router.put("/:id", verifyToken, updateOrderStatus);

// Hapus pesanan
router.delete("/:id", verifyToken, deleteOrder);

module.exports = router;
