// backend/middleware/uploadCloud.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Konfigurasi storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kopikukopi_products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Middleware multer
const upload = multer({ storage });

module.exports = upload;
