const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: { type: String, required: true },
    image: { type: [String], required: false }, // Mảng chứa đường dẫn của hình ảnh
  },
  {
    timestamps: true,
  }
);
const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;