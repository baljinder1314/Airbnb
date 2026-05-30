const User = require("../models/user");

module.exports.signUpUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Register Successful ");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signUp");
  }
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  const currUrl = res.locals.currUrl || "/listings";
  return res.redirect(currUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout success!");
     return res.redirect("/listings");
  });
};
