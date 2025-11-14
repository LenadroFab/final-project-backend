// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadCloud");
const productController = require("../controllers/productController");

// Routes
router.get("/", productController.getProducts);
router.post("/", upload.single("image"), productController.createProduct);
router.put("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
