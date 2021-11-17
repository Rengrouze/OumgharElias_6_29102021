const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/user");
const bouncer = require("express-bouncer")(500, 3600000);

router.post("/signup", usersControllers.signup);
router.post("/login", bouncer.block, usersControllers.login);

module.exports = router;
