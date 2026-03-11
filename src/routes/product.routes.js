const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSimilarProducts,
  getProductById,
  getProductCategories
} = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * CREATE PRODUCT
 * POST /products/create
 */
router.post("/create", authMiddleware, createProduct);

router.get("/all", authMiddleware, getAllProducts);

router.get("/categories", authMiddleware, getProductCategories);

router.get("/similar/:productId", authMiddleware, getSimilarProducts);

router.get("/:productId", authMiddleware, getProductById);



module.exports = router;
