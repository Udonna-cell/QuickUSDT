const express = require("express");
const router = express.Router();
const compile = require("../utility/scssCompile.js");
const { checkEmail } = require("../utility/database/checkExist.js");
const { checkMatch } = require("../utility/database/checkMatchPassword.js");
const Database = require("../utility/database/index.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  res.render("register", { isSignup: false });
});
router.post("/", async function (req, res, next) {
  let user = {
    email: req.body["email"],
    password: req.body["password"],
  };
  //   check if email is valid
  let isEmailValid = await checkEmail(user.email);

  let isPAsswordMatch = await checkMatch(user.password, user.email);

  if (!isEmailValid) {
    user.email = isEmailValid ? user.email : "";
    user.password = isPAsswordMatch ? user.password : "";
    // console.log(user);
    // this is the person that owns the referral link
    let invitee = req.query.r || "null";
    res.render("register", { invitee, isSignup: false, user });
  } else {
    // let feedBack = await insertRecord(user);
    if (isPAsswordMatch) {
      let DB = new Database();
      try {
        let ID = await DB.query("SELECT ID FROM users WHERE email = ?", [
          user.email,
        ]);
        ID = JSON.parse(JSON.stringify(ID.results));
        ID = ID[0];
        console.log(ID);
        res.cookie("ID", ID.ID, {
          maxAge: 900000,
          httpOnly: true,
          secure: false,
        });
      } catch (error) {
        console.log(error);
      }

      res.redirect("/dashboard");
    } else {
      user.email = isEmailValid ? user.email : "";
      user.password = isPAsswordMatch ? user.password : "";
      // this is the person that owns the referral link
      let invitee = req.query.r || "null";
      //   res.send("Can't add record");
      res.render("register", { invitee, isSignup: false, user });
    }
  }
});
module.exports = router;
