const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product id is required",
      });
    }

    // 1️⃣ Check product exists & active
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // 2️⃣ Find user's cart
    let cart = await Cart.findOne({ userId });

    // 3️⃣ If no cart, create one
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });

      return res.status(201).json({
        message: "Product added to cart",
        data: cart,
      });
    }

    // 4️⃣ Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // add new product
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    return res.status(200).json({
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select:
        "name price discountPercentage imageUrl category isFeatured isTrending",
    });

    // 🟡 If cart doesn't exist, return empty cart
    if (!cart) {
      return res.status(200).json({
        message: "Cart fetched successfully",
        data: {
          items: [],
        },
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


module.exports = {
  addToCart,
  getCart
};
