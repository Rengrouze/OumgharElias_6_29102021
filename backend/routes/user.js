const express = require("express");
const router = express.Router();
const useControllers = require("../controllers/user");

router.post("/signup", useCtrl.signup);
router.post("/login", useCtrl.login);

module.exports = router;
