const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  parentRefreshToken: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400, // 30 days
  },
});

const RefreshToken = mongoose.model("Refresh Token", RefreshTokenSchema);
module.exports = RefreshToken;
