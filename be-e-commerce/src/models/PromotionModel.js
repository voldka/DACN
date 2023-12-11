const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    discountType: { type: String, required: true },
    discountValue: { type: Number, required: true },
    expiredDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

const Promotions = mongoose.model('Promotions', promotionSchema);
module.exports = Promotions;
