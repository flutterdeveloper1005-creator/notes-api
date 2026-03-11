const express = require("express");
const { addToCart,  getCart, removeFromCart, updateCartItemQuantity } = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// POST /cart/add
router.post("/add", authMiddleware, addToCart);

// GET /cart
router.get("/", authMiddleware, getCart);

router.delete("/remove/:productId", authMiddleware, removeFromCart);

router.put("/update-quantity", authMiddleware, updateCartItemQuantity);

module.exports = router;
