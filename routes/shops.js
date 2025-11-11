const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Shop, Menu } = require('../models');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/', authenticate, authorizeRole(['admin','staff']),
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try { const shop = await Shop.create(req.body); res.status(201).json(shop); } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try { const shops = await Shop.findAll({ include: { model: Menu, as: 'menus' } }); res.json(shops); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try { const shop = await Shop.findByPk(req.params.id, { include: { model: Menu, as: 'menus' } }); if (!shop) return res.status(404).json({ error: 'Shop not found' }); res.json(shop); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', authenticate, authorizeRole(['admin','staff']),
  body('name').optional().isLength({ min: 1 }).withMessage('Name is required'),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try { const shop = await Shop.findByPk(req.params.id); if (!shop) return res.status(404).json({ error: 'Shop not found' }); await shop.update(req.body); res.json(shop); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authenticate, authorizeRole(['admin']),
  async (req, res) => {
    try { const shop = await Shop.findByPk(req.params.id); if (!shop) return res.status(404).json({ error: 'Shop not found' }); await shop.destroy(); res.json({ message: 'Deleted' }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
