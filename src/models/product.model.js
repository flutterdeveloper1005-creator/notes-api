const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES } = require("../constants/product.constants");
const CATEGORY_VALUES = PRODUCT_CATEGORIES.map(c => c.value);

// const PRODUCT_CATEGORIES = [
//   "electronics",
//   "fashion",
//   "accessories",
//   "home",
//   "beauty",
//   "sports",
//   "shoes"
// ];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORY_VALUES,
        message: "Invalid category"
      },
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0, // 0 = no discount
      min: 0,
      max: 100,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// virtual discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.discountPercentage > 0) {
    return (
      this.price -
      (this.price * this.discountPercentage) / 100
    );
  }
  return this.price;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
