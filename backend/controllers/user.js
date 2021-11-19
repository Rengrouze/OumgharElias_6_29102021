const bcrypt = require("bcrypt"); //for crypting the password
const jwt = require("jsonwebtoken");
const { passwordStrength } = require("check-password-strength"); // check the password strength
const bouncer = require("express-bouncer")(500, 3600000); // for brute force protection

const User = require("../models/User");

exports.signup = (req, res, next) => {
   // check the password strength
   const passwordStrengthResult = passwordStrength(req.body.password);
   if (passwordStrengthResult.id <= 1) {
      // if the password is too weak, reject the request
      res.status(400).json({
         error: "Votre mot de passe est trop faible",
      });
      return;
   }
   bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
         const user = new User({
            email: req.body.email,
            password: hash,
         });
         user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))

            .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ message: "Erreur lors de la création de l'utilisateur !" }));
};

exports.login = (req, res, next) => {
   User.findOne({ email: req.body.email })
      .then((user) => {
         if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
            console.log("Utilisateur non trouvé");
         }
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res.status(401).json({ error: "Mot de passe incorrect !" });
                  console.log("Mot de passe incorrect");
               }
               res.status(200).json({
                  userId: user._id,
                  token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
               });
               bouncer.reset(req);
               console.log("Connexion réussie");
            })
            .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
};
