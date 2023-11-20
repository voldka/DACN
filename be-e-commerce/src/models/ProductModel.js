const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: [{ type: [String]}],
    // image: {
    //   data: Buffer,
    //   contentType: String,
    // },
    // should string array for save list path image
    type: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },

    rating: { type: Number },
    description: { type: String, default: "chưa có mô tả" },
    discount: { type: Number, default: 0 },
    selled: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Products", productSchema);

module.exports = Product;
