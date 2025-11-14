// backend/controllers/paymentController.js
const { Payment, Order, OrderItem, Product, User } = require("../models");

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          include: [
            { model: OrderItem, include: [Product] },
            { model: User, attributes: ["id", "username", "role"] }
          ],
        },
        { model: User, attributes: ["id", "username", "role"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(payments);
  } catch (err) {
    console.error("GET ALL PAYMENTS ERROR:", err);
    res.status(500).json({ message: "Gagal memuat data pembayaran" });
  }
};

exports.createPayment = async (req, res) => {
  try {
    let { order_id, amount, method, customer_name } = req.body;

    // FIX VALIDASI — tidak gunakan !order_id / !amount
    if (order_id == null || amount == null || !method) {
      return res.status(400).json({ message: "Data pembayaran tidak lengkap" });
    }

    if (method === "qris") method = "ewallet";

    const order = await Order.findByPk(order_id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    const paidAmount = Number(amount);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      return res.status(400).json({ message: "Jumlah pembayaran tidak valid" });
    }

    const payment = await Payment.create({
      order_id,
      amount: paidAmount,
      method,
      status: "completed",
      user_id: req.user?.id || null,
    });

    // Update order
    order.status = "paid";
    if (customer_name && customer_name.trim()) {
      order.customer_name = customer_name.trim();
    }
    await order.save();

    return res.status(201).json({
      message: "Pembayaran berhasil dibuat",
      payment,
    });
  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ message: "Gagal membuat pembayaran" });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Order,
          include: [{ model: OrderItem, include: [Product] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(payments);
  } catch (err) {
    console.error("GET MY PAYMENTS ERROR:", err);
    res.status(500).json({ message: "Gagal memuat data pembayaran user" });
  }
};
