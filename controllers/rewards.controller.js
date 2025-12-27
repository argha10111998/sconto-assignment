const Wallet = require("../models/wallet");
const Voucher = require("../models/voucher");
const RedeemedReward = require("../models/redeemedReward");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

exports.redeemVoucher = async (req, res, next) => {
  try{
    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.voucherId)) {
      const err = new Error("Invalid voucher ID");
      err.statusCode = 400;
      throw err;
    }
    const voucher = await Voucher.findById(req.params.voucherId);
    if (!voucher || !voucher.isActive){
      const err = new Error("Voucher not available");
      err.statusCode = 400;
      throw err;
    }
    

    const wallet = await Wallet.findOne({ userId: req.userId });
    if (wallet.balance < voucher.value){
      const err = new Error("Insufficient Balance");
      err.statusCode = 400;
      throw err;
    }
     

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
  }catch(err){
    next(err);
  }
 
};
