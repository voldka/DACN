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
    link: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CarouselModel = mongoose.model("Carousel model", CarouselSchema);
module.exports = CarouselModel;
