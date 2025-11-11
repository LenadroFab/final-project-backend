const express = require('express');
const { Order, OrderItem, Menu } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, items } = req.body;

  const total = items.reduce((sum, x) => sum + (x.qty * x.price), 0);
  const order = await Order.create({ user_id, total });

  for (let item of items) {
    await OrderItem.create({
      order_id: order.id,
      menu_id: item.menu_id,
      qty: item.qty,
      subtotal: item.qty * item.price
    });
  }

  res.json({ msg: "Order created", order_id: order.id });
});

// Tambahkan router GET /all
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['id', 'DESC']],
      include: [
        {
          model: OrderItem,
          include: [Menu] // supaya nama menu ikut tampil
        }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
