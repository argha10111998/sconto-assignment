const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * User Signup
 * POST /api/auth/signup
 */
router.post("/signup", authController.signup);

/**
 * User Login
 * POST /api/auth/login
 */
router.post("/login", authController.login);

module.exports = router;
