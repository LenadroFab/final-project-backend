// backend/controllers/productController.js
const { Product } = require("../models");
const path = require("path");
const fs = require("fs");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const host = `${req.protocol}://${req.get("host")}`;

    const data = products.map((p) => {
      const json = p.toJSON();
      return {
        ...json,
        image_url: json.image_url ? `${host}/uploads/${json.image_url}` : null,
      };
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Gagal memuat produk:", err);
    res.status(500).json({ message: "Gagal memuat produk" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    }

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      image_url: image,
    });

    const host = `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      ...newProduct.toJSON(),
      image_url: image ? `${host}/uploads/${image}` : null,
    });
  } catch (err) {
    console.error("❌ Gagal membuat produk:", err);
    res.status(500).json({ message: "Gagal membuat produk" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const product = await Product.findByPk(id);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (req.file) {
      if (product.image_url) {
        const oldPath = path.join(__dirname, "..", "uploads", product.image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image_url = req.file.filename;
    }

    product.name = name || product.name;
    product.price = price ? parseFloat(price) : product.price;
    await product.save();

    const host = `${req.protocol}://${req.get("host")}`;
    res.json({
      ...product.toJSON(),
      image_url: product.image_url
        ? `${host}/uploads/${product.image_url}`
        : null,
    });
  } catch (err) {
    console.error("❌ Gagal memperbarui produk:", err);
    res.status(500).json({ message: "Gagal memperbarui produk" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (product.image_url) {
      const imagePath = path.join(__dirname, "..", "uploads", product.image_url);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.destroy();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus produk:", err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
