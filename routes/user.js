const { Router } = require("express");

const asyncWrap = require("../utils/asyncWrap");
const User = require("../models/user");
const passport = require("passport");
const { currUrlIs } = require("../middleware/isLoggedIn");

const userControllers = require("../controllers/user.js");

const userRouter = Router();

userRouter.get(
  "/signUp",
  asyncWrap(async (req, res) => {
    res.render("user/signUp.ejs");
  }),
);

userRouter.post("/signUp", asyncWrap(userControllers.signUpUser));

userRouter.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

userRouter.post(
  "/login",
  currUrlIs,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  asyncWrap(userControllers.loginUser),
);


userRouter.get("/logout", userControllers.logoutUser, (req, res) => {
  return res.redirect("/listings");
});

module.exports = userRouter;
