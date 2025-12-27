const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");

exports.getWallet = async (req, res) => {
  try{
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }
    const wallet = await Wallet.findOne({ userId: req.userId });
    const transactions = await Transaction.find({ userId: req.userId });

    res.json({ balance: wallet.balance, transactions });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
  
};

exports.addMoney = async (req, res) => {

  try{
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ userId: req.userId });
    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      userId: req.userId,
      type: "CREDIT",
      amount,
    });

    res.json({ message: "Money added successfully" });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
  
};

exports.redeemMoney = async (req, res) => {
  try{
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ userId: req.userId });

    if (wallet.balance < amount)
      return res.status(400).json({ message: "Insufficient Balance" });

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      userId: req.userId,
      type: "DEBIT",
      amount,
    });

    res.json({ message: "Amount redeemed successfully" });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }

};
