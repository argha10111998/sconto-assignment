const router = require("express").Router();
const auth = require("../midleware/auth");
const controller = require("../controllers/rewards.controller");

router.post("/redeem/:voucherId", auth, controller.redeemVoucher);

module.exports = router;
