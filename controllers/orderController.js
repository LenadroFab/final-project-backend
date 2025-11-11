// backend/controllers/orderController.js
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");
const User = require("../models/user");

// ================================
// 🔍 GET ALL ORDERS (Admin / Kasir)
// ================================
exports.getAllOrders = async (req, res) => {
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
    console.error("❌ Gagal memuat pesanan:", err);
    res.status(500).json({ message: "Gagal memuat pesanan" });
  }
};

// ================================
// 👤 GET ORDER BY USER (Customer)
// ================================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "price"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("❌ Gagal memuat pesanan user:", err);
    res.status(500).json({ message: "Gagal memuat pesanan user" });
  }
};

// ================================
// ➕ CREATE ORDER
// ================================
// backend/controllers/orderController.js
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    console.log("🧾 Payload diterima:", { items, total });
    console.log("👤 User dari token:", req.user);

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Pesanan kosong!" });
    }

    if (!req.user?.id) {
      return res.status(400).json({ message: "User tidak valid dalam token" });
    }

    // Buat order utama
    const order = await Order.create({
      user_id: req.user.id,
      total,
      status: "pending",
    });
    console.log("✅ Order berhasil dibuat:", order.id);

    // Siapkan order item
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      qty: item.qty || 1,
      price: item.price,
      subtotal: (item.price || 0) * (item.qty || 1),
    }));

    console.log("🛒 Order items:", orderItems);

    await OrderItem.bulkCreate(orderItems);
    console.log("✅ Order items berhasil disimpan");

    res.status(201).json({ message: "Pesanan berhasil dibuat", order });
  } catch (err) {
    console.error("❌ Gagal membuat pesanan:", err.message);
    res
      .status(500)
      .json({ message: "Gagal membuat pesanan", error: err.message });
  }
};

// ================================
// ✏️ UPDATE ORDER STATUS
// ================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order)
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    order.status = status || "completed";
    await order.save();

    res.json({ message: "Status pesanan diperbarui", order });
  } catch (err) {
    console.error("❌ Gagal memperbarui pesanan:", err);
    res.status(500).json({ message: "Gagal memperbarui pesanan" });
  }
};

// ================================
// 🗑️ DELETE ORDER
// ================================
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order)
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    await OrderItem.destroy({ where: { order_id: id } });
    await order.destroy();

    res.json({ message: "Pesanan berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus pesanan:", err);
    res.status(500).json({ message: "Gagal menghapus pesanan" });
  }
};
