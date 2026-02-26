const express = require("express");
const { addToCart,  getCart } = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// POST /cart/add
router.post("/add", authMiddleware, addToCart);

// GET /cart
router.get("/", authMiddleware, getCart);

module.exports = router;
