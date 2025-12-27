const User = require("../models/user"); 
const Wallet = require("../models/wallet"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }
    const { name, email, phone, password } = req.body;

    // Required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Name validation (min 3 chars)
    if (name.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters long" });
    }

    // Phone: exactly 10 digits, must not start with 0
    if (!/^[1-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be 10 digits and must not start with 0",
      });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      phone,
      password: hashedPassword,
    });

    await Wallet.create({ userId: user._id, balance: 0 });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.login = async (req, res) => {
  try{
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Request body is missing",
        });
      }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
 
};
