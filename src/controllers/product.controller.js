const Product = require("../models/product.model");

/**
 * CREATE PRODUCT
 * (for now, any authenticated user can create)
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;

    // 1️⃣ Validate input
    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Product name and price are required",
      });
    }

    // 2️⃣ Create product
    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
    });

    // 3️⃣ Response
    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * GET ALL PRODUCTS (GLOBAL)
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
};
