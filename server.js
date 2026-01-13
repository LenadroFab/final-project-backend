// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// =======================================
// 🔒 CORS CONFIG (FINAL – PRODUCTION SAFE)
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

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// preflight
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
  res.json({
    status: "OK",
    message: "Backend KopiKuKopi running on Railway 🚀",
  });
});

// =======================================
// DATABASE & SERVER START (FINAL)
// =======================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway PostgreSQL");

    // ❌ JANGAN sync / alter / force di production
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
    process.exit(1);
  }
})();
