// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { sequelize, User } = require("./models");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// =======================================
// 🔒 CORS CONFIG (FINAL – PRODUCTION READY)
// =======================================
const allowedOrigins = [
  "https://final-project-frontend-coral.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔥 WAJIB UNTUK PREFLIGHT (OPTIONS)
app.options("*", cors());

// =======================================
// BODY PARSER
// =======================================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =======================================
// ROUTES
// =======================================
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend KopiKuKopi running on Railway" });
});

// =======================================
// DATABASE & SERVER START
// =======================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");

    // SEED USERS
    const seedUser = async (username, password, role) => {
      const exist = await User.findOne({ where: { username } });
      if (!exist) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashed, role });
        console.log(`👤 User dibuat: ${username}/${password}`);
      }
    };

    await seedUser("admin", "admin123", "admin");
    await seedUser("kasir", "kasir123", "kasir");
    await seedUser("customer", "cust123", "customer");

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
})();