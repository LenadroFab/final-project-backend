// backend/controllers/productController.js
const Product = require("../models/product");
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
        image: json.image ? `${host}/uploads/${json.image}` : null,
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

    const cleanPrice = parseFloat(price);

    const newProduct = await Product.create({
      name,
      price: cleanPrice,
      image,
    });

    // 🔥 Tambahkan URL gambar penuh sebelum dikirim ke frontend
    const host = `${req.protocol}://${req.get("host")}`;
    const result = {
      ...newProduct.toJSON(),
      image: newProduct.image ? `${host}/uploads/${newProduct.image}` : null,
    };

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Gagal membuat produk:", err);
    res
      .status(500)
      .json({ message: "Gagal membuat produk", error: err.message });
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
      if (product.image) {
        const oldPath = path.join(__dirname, "..", "uploads", product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image = req.file.filename;
    }

    product.name = name || product.name;
    product.price = price ? parseFloat(price) : product.price;

    await product.save();

    // Tambahkan URL gambar penuh di response
    const host = `${req.protocol}://${req.get("host")}`;
    const result = {
      ...product.toJSON(),
      image: product.image ? `${host}/uploads/${product.image}` : null,
    };

    res.json(result);
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

    if (product.image) {
      const imagePath = path.join(__dirname, "..", "uploads", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.destroy();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus produk:", err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
