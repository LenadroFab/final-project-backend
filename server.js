// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const sequelize = require("./db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Import Models
const User = require("./models/user");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");
const Product = require("./models/product");
const Payment = require("./models/payment");

// Import Relations
require("./models/relations");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ==============================
// 🔧 MIDDLEWARES
// ==============================
app.use(cors());
app.use(express.json());

// 🖼️ Serve folder uploads (gambar produk)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// 🔄 Pastikan folder uploads tersedia
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("📂 Folder 'uploads' dibuat otomatis");
}

// ==============================
// 🚀 ROUTES
// ==============================
app.use("/auth", authRoutes);
app.use("/users", userRoutes); // ❌ sebelumnya dobel
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);

// Root check (tes server)
app.get("/", (req, res) =>
  res.json({ message: "☕ KopiKuKopi Backend API berjalan lancar!" })
);

// ==============================
// 🧩 DATABASE SYNC & SERVER START
// ==============================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Gunakan alter agar tabel update otomatis tanpa reset data
    await sequelize.sync({ alter: true });

    // === Seed akun default jika belum ada ===
    const seedUser = async (username, password, role) => {
      const exist = await User.findOne({ where: { username } });
      if (!exist) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashed, role });
        console.log(`👤 Akun ${role} dibuat: ${username}/${password}`);
      }
    };

    await seedUser("admin", "admin123", "admin");
    await seedUser("kasir", "kasir123", "kasir");
    await seedUser("customer", "cust123", "customer");

    // Jalankan server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(
        `📸 Gambar produk disajikan di: http://localhost:${PORT}/uploads`
      );
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();
