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

  try{
    
    const { amount } = req.body;
    if(!amount){
      const err = new Error("Amount Required");
      err.statusCode = 400;
      throw err;
    }
    if (amount <= 0){
      const err = new Error("Invalid amount");
      err.statusCode = 400;
      throw err;
    } 

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
    next(err);
  }
  
};

exports.redeemMoney = async (req, res, next) => {
  try{
    const { amount } = req.body;
    if(!amount){
      const err = new Error("Amount Required");
      err.statusCode = 400;
      throw err;
    }
    if (amount <= 0){
      const err = new Error("Invalid amount");
      err.statusCode = 400;
      throw err;
    } 
    const wallet = await Wallet.findOne({ userId: req.userId });

    if (wallet.balance < amount){
      const err = new Error("Insufficient Balance");
      err.statusCode = 400;
      throw err;
    }
      
    

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      userId: req.userId,
      type: "DEBIT",
      amount,
    });

    res.json({ message: "Amount redeemed successfully" });
  }catch(err){
    next(err);
  }

};
