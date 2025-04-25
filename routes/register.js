const express = require("express");
// const sass = require("sass");
// const fs = require("fs");
// const path = require("path");
const router = express.Router();
const compile = require("../utility/scssCompile.js");
const {
  checkEmail,
  checkUsername,
} = require("../utility/database/checkExist.js");
/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  // this is the person that owns the referral link
  let invitee = req.query.r || "null";
  //   console.log(invitee);

  res.render("register", { invitee, isSignup: true });
});
router.post("/", async function (req, res, next) {
  // received data from form
  let user = {
    firstName: req.body["first-name"],
    lastName: req.body["last-name"],
    username: req.body["username"],
    email: req.body["email"],
    password: req.body["password"],
  };
  let isUsernameValid = await checkUsername(user.username);
  let isEmailValid = await checkEmail(user.email);

  if (isEmailValid || isUsernameValid) {
    user.email = (isEmailValid)? "" : user.email
    user.username = (isUsernameValid)? "" : user.username
    console.log(user);
    // this is the person that owns the referral link
    let invitee = req.query.r || "null";
    res.render("register", { invitee, isSignup: true, user });
  }
});
module.exports = router;
