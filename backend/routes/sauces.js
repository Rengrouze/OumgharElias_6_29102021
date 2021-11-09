const express = require("express");
const router = express.Router();

const saucesControllers = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, saucesCtrl.getAllSauces);

router.get("/:id", auth, saucesCtrl.getOneSauce);

router.post("/", auth, multer, saucesCtrl.createSauce);

router.put("/:id", auth, multer, saucesCtrl.updateSauce);

router.delete("/:id", auth, saucesCtrl.deleteSauce);

router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
