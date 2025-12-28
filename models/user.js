const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
       minlength: 10,
      maxlength: 10,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
      required: true,
    },
    password: {
      type: String, // store HASHED password here
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("User", UserSchema);

