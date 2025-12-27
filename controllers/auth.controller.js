const User = require("../models/user"); 
const Wallet = require("../models/wallet"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      const err = new Error("Request body is missing");
      err.statusCode = 400;
      throw err;
    }

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      const err = new Error("All fields required");
      err.statusCode = 400;
      throw err;
    }

    if (name.trim().length < 3) {
      const err = new Error("Name must be at least 3 characters long");
      err.statusCode = 400;
      throw err;
    }

    const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    

    if (!emailRegex.test(email)) {
      const err = new Error("Invalid email format");
      err.statusCode = 400;
      throw err;
    }

    if (!/^[1-9]\d{9}$/.test(phone)) {
      const err = new Error("Phone number must be 10 digits and must not start with 0");
      err.statusCode = 400;
      throw err;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      const err = new Error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      err.statusCode = 400;
      throw err;
    }

    const exists = await User.findOne({ email });
    if (exists) {
      const err = new Error("Email already exists");
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      phone,
      password: hashedPassword,
    });

    await Wallet.create({ userId: user._id, balance: 0 });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    next(err); 
  }
};



exports.login = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      const err = new Error("Request body is missing");
      err.statusCode = 400;
      throw err;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      data: { token },
    });

  } catch (err) {
    next(err);
  }
};

