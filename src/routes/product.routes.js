const express = require("express");
const {
  createProduct,
  getAllProducts,
} = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * CREATE PRODUCT
 * POST /products/create
 */
router.post("/create", authMiddleware, createProduct);

/**
 * GET ALL PRODUCTS (GLOBAL)
 * GET /products/all
 */
router.get("/all", authMiddleware, getAllProducts);

module.exports = router;
