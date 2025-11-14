const { Order, OrderItem, Product, User } = require("../models");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "username", "role"] },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "image_url"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ GET ALL ORDERS ERROR:", err);
    res.status(500).json({ message: "Gagal memuat pesanan" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "image_url"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ GET MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Gagal memuat pesanan user" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, total, total_amount } = req.body;

    const finalTotal =
      typeof total_amount !== "undefined" ? total_amount : total;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Pesanan kosong!" });
    }
    if (!finalTotal || isNaN(Number(finalTotal))) {
      return res.status(400).json({ message: "Total pesanan tidak valid" });
    }

    const order = await Order.create({
      user_id: req.user?.id || null,
      total_amount: finalTotal,
      status: "pending",
    });

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      qty: item.qty || 1,
      price: item.price,
      subtotal: (Number(item.price) || 0) * (Number(item.qty) || 1),
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      orderId: order.id,
      order,
    });
  } catch (err) {
    console.error("❌ CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Gagal membuat pesanan" });
  }
};

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
    console.error("❌ UPDATE ORDER ERROR:", err);
    res.status(500).json({ message: "Gagal memperbarui pesanan" });
  }
};

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
    console.error("❌ DELETE ORDER ERROR:", err);
    res.status(500).json({ message: "Gagal menghapus pesanan" });
  }
};
