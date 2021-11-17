const toobusy = require("toobusy-js");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const app = express();

// Middlewares
app.use(
   // for cookie protection
   session({
      resave: true,
      saveUninitialized: true,
      secret: "your-secret-key",
      key: "cookieName",
      cookie: { secure: true, httpOnly: true, path: "/user", sameSite: true },
   })
);

app.use(function (req, res, next) {
   // for dos attack
   if (toobusy()) {
      res.send(503, "I'm busy right now, sorry.");
   } else {
      next();
   }
});

mongoose // connect to mongoDB
   .connect("mongodb+srv://Rengret:admin@testoc.cmc03.mongodb.net/test?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
   // avoid Cors errors
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
   next();
});

app.use(express.json({ limit: "5kb" })); // for parsing application/json and limit the size of the body
app.use(mongoSanitize()); // for sanitize the data from sql injection

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
