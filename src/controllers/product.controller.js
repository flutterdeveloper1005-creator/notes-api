const Product = require("../models/product.model");

/**
 * CREATE PRODUCT
 * (for now, any authenticated user can create)
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPercentage,
      isFeatured,
      isTrending,
      imageUrl,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      discountPercentage: discountPercentage || 0,
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      imageUrl,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    // ✅ Mongoose validation error
    if (error.name === "ValidationError") {
      // Pick the FIRST validation message
      const firstErrorKey = Object.keys(error.errors)[0];
      const firstErrorMessage = error.errors[firstErrorKey].message;

      return res.status(400).json({
        message: firstErrorMessage,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * GET ALL PRODUCTS (GLOBAL)
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      trending,
      discount,
      search,
    } = req.query;

    const filter = { isActive: true };

    // 🔹 Category filter
    if (category) {
      filter.category = category;
    }

    // 🔹 Featured filter
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // 🔹 Trending filter
    if (trending === "true") {
      filter.isTrending = true;
    }

    // 🔹 Discount filter
    if (discount === "true") {
      filter.discountPercentage = { $gt: 0 };
    }

    // 🔍 SEARCH LOGIC (NEW)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(6);

    res.status(200).json({
      message: "Similar products fetched",
      data: similarProducts,
    });
  } catch (error) {
    console.error("Similar products error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Basic ID validation
    if (!productId) {
      return res.status(400).json({
        message: "Product id is required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product by id error:", error);

    // Invalid ObjectId format
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


module.exports = {
  createProduct,
  getAllProducts,
  getSimilarProducts,
  getProductById,
};
