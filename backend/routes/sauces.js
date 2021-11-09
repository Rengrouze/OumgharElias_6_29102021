const express = require("express");
const router = express.Router();

const saucesControllers = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, saucesControllers.getAllSauces);

router.get("/:id", auth, saucesControllers.getOneSauce);

router.post("/", auth, multer, saucesControllers.createSauce);

router.put("/:id", auth, multer, saucesControllers.updateSauce);

router.delete("/:id", auth, saucesControllers.deleteSauce);

router.post("/:id/like", auth, saucesControllers.likeSauce);

module.exports = router;
