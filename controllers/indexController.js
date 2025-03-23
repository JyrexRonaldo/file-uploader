const passport = require("../config/passport");
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

function getLogInPage(req, res) {
  res.render("forms/log-in-form");
}

function getSignUpPage(req, res) {
  res.render("forms/sign-up-form");
}

async function addNewUser(req, res, next) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  next();
}

async function getHomePage(req, res) {
  res.render("pages/home-page");
}

const authenticateUser = passport.authenticate("local", {
  successRedirect: "/storage",
  failureRedirect: "/log-in",
});

function logOutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/log-in");
  });
}

module.exports = {
  addNewUser,
  getLogInPage,
  getSignUpPage,
  getHomePage,
  authenticateUser,
  logOutUser,
};
