const { Product } = require("../models");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error("❌ Gagal memuat produk:", err);
    res.status(500).json({ message: "Gagal memuat produk" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    const image_url = req.file ? req.file.path : null; // secure_url Cloudinary

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      image_url,
    });

    res.status(201).json(newProduct);
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
      product.image_url = req.file.path; // Cloudinary secure_url baru
    }

    product.name = name || product.name;
    product.price = price ? parseFloat(price) : product.price;

    await product.save();

    res.json(product);
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

    await product.destroy();

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus produk:", err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
