const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const router = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOOSE_URL);
  return "DB Connected Successfully";
}

const sessionOptions = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.get("/", (req, res) => {
  res.send("I am root");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demo", async (req, res) => {
//   const fakeUser = await User({
//     email: "name@gmail.com",
//     username: "name",
//   });

//   const user = await User.register(fakeUser, "hello");
//   res.send(user);
// });

//index route
app.use("/listings", router);

// add review
app.use("/listings/:id/review", reviewRouter);

//User Router
app.use("/", userRouter);

//error handling
app.all("*splat", (req, res, next) => {
  return next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some went wrong" } = err;
  res.status(status).render("listing/error.ejs", { message });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`);
});
