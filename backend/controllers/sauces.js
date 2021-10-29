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
   Sauce.findOne({
      _id: req.params.id,
   })
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
   delete sauceObject._id;
   const sauce = new Sauce({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      userliked: [],
      userdisliked: [],

      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
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
   const sauceObject = req.file
      ? {
           ...JSON.parse(req.body.sauce),
           imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };
   // if there is a new image, delete the old one
   if (req.file) {
      Sauce.findOne({ _id: req.params.id })
         .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (err) => {
               if (err) {
                  console.log(err);
               }
            });
         })
         .catch((error) => {
            res.status(400).json({
               error: error,
            });
         });
   }
   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then((result) => {
         res.status(200).json({
            message: "Sauce updated successfully!",
            sauce: sauceObject,
         });
      })
      .catch((error) => res.status(400).json({ error: error }));
};

exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
         const filename = sauce.imageUrl.split("/images/")[1];
         fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
               .then(() => res.status(200).json({ message: "Sauce deleted!" }))
               .catch((error) => res.status(400).json({ error: error }));
         });
      })
      .catch((error) => res.status(400).json({ error: error }));
};

exports.likeSauce = (req, res, next) => {
   //get the sauce and the actual number of likes
   Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      //check if the user has already liked the sauce
      // check request, if it is a like or a dislike
      if (req.body.like == 1) {
         sauce.likes++;
         sauce.usersLiked.push(req.body.userId);
         sauce
            .save()
            .then((sauce) => {
               res.status(200).json({
                  message: "Sauce liked!",
                  sauce: sauce,
               });
            })
            .catch((error) => res.status(400).json({ error: error }));
      }
      if (req.body.like == -1) {
         sauce.dislikes++;
         sauce.usersDisliked.push(req.body.userId);
         sauce
            .save()
            .then((sauce) => {
               res.status(200).json({
                  message: "Sauce disliked!",
                  sauce: sauce,
               });
            })
            .catch((error) => res.status(400).json({ error: error }));
      }
      if (req.body.like == 0) {
         //check if the user has liked or disliked the sauce and remove him from the array
         if (sauce.usersLiked.includes(req.body.userId)) {
            sauce.likes--;
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
            sauce
               .save()
               .then((sauce) => {
                  res.status(200).json({
                     message: "Like removed",
                     sauce: sauce,
                  });
               })
               .catch((error) => res.status(400).json({ error: error }));
         }
         if (sauce.usersDisliked.includes(req.body.userId)) {
            sauce.dislikes--;
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
            sauce
               .save()
               .then((sauce) => {
                  res.status(200).json({
                     message: "Dislike removed !",
                     sauce: sauce,
                  });
               })
               .catch((error) => res.status(400).json({ error: error }));
         }
      }
   });
};
