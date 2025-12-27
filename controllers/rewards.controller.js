const Wallet = require("../models/wallet");
const Voucher = require("../models/voucher");
const RedeemedReward = require("../models/redeemedReward");
const Transaction = require("../models/transaction");

exports.redeemVoucher = async (req, res) => {
  const voucher = await Voucher.findById(req.params.voucherId);
  if (!voucher || !voucher.isActive)
    return res.status(404).json({ message: "Voucher not available" });

  const wallet = await Wallet.findOne({ userId: req.userId });
  if (wallet.balance < voucher.value)
    return res.status(400).json({ message: "Insufficient Balance" });

  wallet.balance -= voucher.value;
  await wallet.save();

  await Transaction.create({
    userId: req.userId,
    type: "DEBIT",
    amount: voucher.value,
  });

  await RedeemedReward.create({
    userId: req.userId,
    voucherId: voucher._id,
    voucherValue: voucher.value,
  });

  res.json({ message: "Voucher redeemed successfully" });
};
