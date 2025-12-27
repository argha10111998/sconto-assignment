const router = require("express").Router();
const auth = require("../midleware/auth");
const controller = require("../controllers/wallet.controller");

router.get("/", auth, controller.getWallet);
router.post("/add-money", auth, controller.addMoney);
router.post("/redeem", auth, controller.redeemMoney);

module.exports = router;
