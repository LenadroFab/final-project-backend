const express = require('express');
const { Menu } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Menu.findAll()));
router.post('/', async (req, res) => {
  const { name, price } = req.body;
  res.json(await Menu.create({ name, price }));
});

module.exports = router;
