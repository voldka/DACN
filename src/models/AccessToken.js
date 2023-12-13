const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400, // 30 days
  },
});

const AccessToken = mongoose.model('Access Tokens', AccessTokenSchema);
module.exports = AccessToken;
