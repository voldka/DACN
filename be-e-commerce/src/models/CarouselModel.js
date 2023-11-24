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
    image: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CarouselModel = mongoose.model("Carousels", CarouselSchema);
module.exports = CarouselModel;
