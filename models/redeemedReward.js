const mongoose = require("mongoose");

const RedeemedRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
  voucherValue: Number,
  redeemedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RedeemedReward", RedeemedRewardSchema);
