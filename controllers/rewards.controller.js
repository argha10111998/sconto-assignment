const Wallet = require("../models/wallet");
const Voucher = require("../models/voucher");
const RedeemedReward = require("../models/redeemedReward");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

exports.redeemVoucher = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
     
    session.startTransaction();

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.voucherId)) {
      const err = new Error("Invalid voucher ID");
      err.statusCode = 400;
      throw err;
    }

    // 2️⃣ Fetch voucher inside transaction
    const voucher = await Voucher.findOne({
      _id: req.params.voucherId,
      isActive: true
    }).session(session);

    if (!voucher) {
      const err = new Error("Voucher not available");
      err.statusCode = 400;
      throw err;
    }

    // 3️⃣ Prevent duplicate redemption
    // const alreadyRedeemed = await RedeemedReward.findOne({
    //   userId: req.userId,
    //   voucherId: voucher._id
    // }).session(session);

    // if (alreadyRedeemed) {
    //   const err = new Error("Voucher already redeemed");
    //   err.statusCode = 400;
    //   throw err;
    // }

    // 4️⃣ ATOMIC wallet deduction
    const wallet = await Wallet.findOneAndUpdate(
      {
        userId: req.userId,
        balance: { $gte: voucher.value }
      },
      {
        $inc: { balance: -voucher.value }
      },
      { new: true, session }
    );

    if (!wallet) {
      const err = new Error("Insufficient Balance");
      err.statusCode = 400;
      throw err;
    }

    // 5️⃣ Create transaction record
    await Transaction.create([{
      userId: req.userId,
      type: "DEBIT",
      amount: voucher.value,
    }], { session });

    // 6️⃣ Mark voucher as redeemed
    await RedeemedReward.create([{
      userId: req.userId,
      voucherId: voucher._id,
      voucherValue: voucher.value,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Voucher redeemed successfully" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

