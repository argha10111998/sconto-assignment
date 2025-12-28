const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
exports.getWallet = async (req, res, next) => {
  try{
   
    const wallet = await Wallet.findOne({ userId: req.userId });
    const transactions = await Transaction.find({ userId: req.userId });

    res.json({ balance: wallet.balance, transactions });
  }catch(err){
    next(err);
  }
  
};

exports.addMoney = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      const err = new Error("Request body is missing");
      err.statusCode = 400;
      throw err;
    }
    session.startTransaction();
    
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      const err = new Error("Invalid amount");
      err.statusCode = 400;
      throw err;
    }

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.userId },
      { $inc: { balance: amount } },
      { new: true, session }
    );

    if (!wallet) {
      const err = new Error("Wallet not found");
      err.statusCode = 404;
      throw err;
    }

    await Transaction.create([{
      userId: req.userId,
      type: "CREDIT",
      amount,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Money added successfully",
      balance: wallet.balance,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
exports.redeemMoney = async (req, res, next) => {
  
  const session = await mongoose.startSession();

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      const err = new Error("Request body is missing");
      err.statusCode = 400;
      throw err;
    }
    session.startTransaction();

    

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      const err = new Error("Invalid amount");
      err.statusCode = 400;
      throw err;
    }

    const wallet = await Wallet.findOneAndUpdate(
      {
        userId: req.userId,
        balance: { $gte: amount }
      },
      {
        $inc: { balance: -amount }
      },
      { new: true, session }
    );

    if (!wallet) {
      const err = new Error("Insufficient Balance");
      err.statusCode = 400;
      throw err;
    }

    await Transaction.create([{
      userId: req.userId,
      type: "DEBIT",
      amount,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Amount redeemed successfully",
      balance: wallet.balance,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
