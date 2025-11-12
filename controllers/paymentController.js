// backend/controllers/paymentController.js
const { Payment, Order, OrderItem, Product, User } = require("../models");
const { Op } = require("sequelize");

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          include: [
            { model: OrderItem, include: [Product] },
            { model: User, attributes: ["id", "username", "role"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memuat data pembayaran" });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { order_id, amount, method } = req.body;

    if (!order_id || !amount || !method)
      return res.status(400).json({ message: "Data pembayaran tidak lengkap" });

    const order = await Order.findByPk(order_id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    const payment = await Payment.create({
      order_id,
      user_id: req.user?.id || null,
      amount,
      method,
      status: "completed",
    });

    // Update status order setelah pembayaran
    order.status = "paid";
    await order.save();

    res.status(201).json({
      message: "Pembayaran berhasil dibuat",
      payment,
    });
  } catch (err) {
    console.error(err);
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
    });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memuat data pembayaran user" });
  }
};
