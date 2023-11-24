const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarouselSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    images: [{ type: [String] }],
  },
  {
    timestamps: true,
  }
);

const CarouselModel = mongoose.model("Carousels", CarouselSchema);
module.exports = CarouselModel;
