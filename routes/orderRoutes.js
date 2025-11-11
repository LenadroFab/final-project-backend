// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");
const User = require("../models/user");

// ================================
// 🧾 Ambil Semua Order (Admin / Kasir)
// ================================
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "username", "role"] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "price"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memuat data order" });
  }
});

// ================================
// 🧍‍♂️ Ambil Order Berdasarkan User Login
// ================================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price"] }],
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memuat pesanan user" });
  }
});

// ================================
// 🛒 Buat Order Baru
// ================================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Pesanan kosong!" });
    }

    // Buat order baru
    const order = await Order.create({
      user_id: req.user.id,
      total,
      status: "pending",
    });

    // Buat order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      qty: item.qty || 1,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      orderId: order.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat pesanan" });
  }
});

// ================================
// ✅ Update Status Order (Admin / Kasir)
// ================================
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = status || "completed";
    await order.save();

    res.json({ message: "Status pesanan diperbarui", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui status pesanan" });
  }
});

module.exports = router;
