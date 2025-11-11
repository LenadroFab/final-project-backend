const Payment = require("../models/payment");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");
const User = require("../models/user");

// ============================================================
// 🧾 CREATE PAYMENT
// ============================================================
exports.createPayment = async (req, res) => {
  try {
    const { customerName, totalAmount, method, items } = req.body;

    // Validasi input
    if (!customerName || !totalAmount || !method || !items?.length) {
      return res.status(400).json({
        message: "Nama, total, metode, dan item wajib diisi!",
      });
    }

    // 🔍 Cari user berdasarkan nama (atau buat baru)
    let user = await User.findOne({ where: { username: customerName } });
    if (!user) {
      user = await User.create({
        username: customerName,
        password: "default123", // default password
        role: "customer",
      });
    }

    // 🧾 Buat order baru
    const order = await Order.create({
      user_id: user.id,
      total: totalAmount,
      status: "pending",
    });

    // 💾 Simpan setiap produk ke order_items
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.productId,
        quantity: 1,
        price: item.price,
      });
    }

    // 💳 Simpan payment baru
    const payment = await Payment.create({
      order_id: order.id,
      user_id: user.id,
      amount: totalAmount,
      method,
      status: "pending",
    });

    res.status(201).json({
      message: "✅ Pembayaran berhasil dibuat!",
      payment,
    });
  } catch (err) {
    console.error("❌ Gagal membuat pembayaran:", err);
    res.status(500).json({
      message: "Gagal membuat pembayaran",
      error: err.message,
    });
  }
};

// ============================================================
// 💰 GET ALL PAYMENTS
// ============================================================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Order, attributes: ["id", "total", "status"] },
        { model: User, attributes: ["id", "username"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(payments);
  } catch (err) {
    console.error("❌ Gagal mengambil daftar pembayaran:", err);
    res.status(500).json({ message: "Gagal mengambil daftar pembayaran" });
  }
};
