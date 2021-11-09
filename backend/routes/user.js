const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/user");

router.post("/signup", usersControllers.signup);
router.post("/login", usersControllers.login);

module.exports = router;
