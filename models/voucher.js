const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  brand: String,
  value: Number,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Voucher", VoucherSchema);
