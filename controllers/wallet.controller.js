const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");

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
  try {
    const { amount } = req.body;

    if (!amount) {
      const err = new Error("Amount Required");
      err.statusCode = 400;
      throw err;
    }

    if (amount <= 0) {
      const err = new Error("Invalid amount");
      err.statusCode = 400;
      throw err;
    }

    // ATOMIC wallet update
    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.userId },          // Filter by user
      { $inc: { balance: amount } },   // Atomic increment
      { new: true }                    // Return the updated wallet
    );

    // Create transaction AFTER wallet update
    await Transaction.create({
      userId: req.userId,
      type: "CREDIT",
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Money added successfully",
      balance: wallet.balance, // optional: return new balance
    });
  } catch (err) {
    next(err);
  }
};

exports.redeemMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      const err = new Error("Amount Required");
      err.statusCode = 400;
      throw err;
    }

    if (amount <= 0) {
      const err = new Error("Invalid amount");
      err.statusCode = 400;
      throw err;
    }

    // ATOMIC wallet deduction
    const wallet = await Wallet.findOneAndUpdate(
      {
        userId: req.userId,
        balance: { $gte: amount } // ensures sufficient funds
      },
      {
        $inc: { balance: -amount }
      },
      { new: true } // return updated document
    );

    if (!wallet) {
      const err = new Error("Insufficient Balance");
      err.statusCode = 400;
      throw err;
    }

    // Create transaction AFTER wallet update
    await Transaction.create({
      userId: req.userId,
      type: "DEBIT",
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Amount redeemed successfully",
      balance: wallet.balance, // optional
    });

  } catch (err) {
    next(err);
  }
};
