const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
   Sauce.find()
      .then((things) => {
         res.status(200).json(things);
      })
      .catch((error) => {
         res.status(400).json({
            error: error,
         });
      });
};

exports.getOneSauce = (req, res, next) => {
   const sauceId = req.params.sauceId;
   Sauce.findById(sauceId)
      .then((sauce) => {
         res.status(200).json(sauce);
      })
      .catch((error) => {
         res.status(400).json({
            error: error,
         });
      });
};

exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   //get the userId from monogoose

   delete sauceObject._id;
   const sauce = new Sauce({
      userId: req.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      likes: [0],
      dislikes: [0],
      usersLiked: [],
      usersDisliked: [],
   });
   sauce
      .save()
      .then((sauce) => {
         res.status(201).json({
            message: "Sauce created successfully!",
            sauce: sauce,
         });
      })
      .catch((error) => {
         res.status(400).json({
            error: error,
         });
      });
};

exports.updateSauce = (req, res, next) => {
   const sauceId = req.params.sauceId;
   const updatedSauce = req.body;
   Sauce.findByIdAndUpdate(sauceId, updatedSauce)
      .then((sauce) => {
         res.status(200).json({
            message: "Sauce updated successfully!",
            sauce: sauce,
         });
      })
      .catch((error) => {
         res.status(400).json({
            error: error,
         });
      });
};

exports.deleteSauce = (req, res, next) => {
   const sauceId = req.params.sauceId;
   Sauce.findByIdAndRemove(sauceId)
      .then((sauce) => {
         res.status(200).json({
            message: "Sauce deleted successfully!",
            sauce: sauce,
         });
      })
      .catch((error) => {
         res.status(400).json({
            error: error,
         });
      });
};

exports.likeSauce = (req, res, next) => {
   const sauceId = req.params.sauceId;
   const userId = req.body.userId;
   Sauce.findById(sauceId)
      .then((sauce) => {
         if (sauce.likes.filter((like) => like.userId.toString() === userId).length > 0) {
            return res.status(400).json({
               message: "Sauce already liked!",
            });
         }
         sauce.likes.unshift({ userId: userId });
         sauce
            .save()
            .then((sauce) => {
               res.status(200).json({
                  message: "Sauce liked successfully!",
                  sauce: sauce,
               });
            })
            .catch((error) => {
               res.status(400).json({
                  error: error,
               });
            });
      })
      .catch((error) => {
         res.status(400).json({
            error: error,
         });
      });
};
