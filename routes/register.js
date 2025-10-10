const express = require("express");
const router = express.Router();
const compile = require("../utility/scssCompile.js");
const {
  checkEmail,
  checkUsername,
} = require("../utility/database/checkExist.js");
const { insertUser, insertInvite } = require("../utility/database/insert.js");
const { Transaction } = require("../utility/transaction.js");
const { getUserID } = require("../utility/generateID.js");


/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  // this is the person that owns the referral link
  let invitee = req.query.r || "null";
  res.render("register", { invitee, isSignup: true });
});

router.post("/", async function (req, res, next) {
  // received data from form including the invite
  let user = {
    firstName: req.body["first-name"],
    lastName: req.body["last-name"],
    username: req.body["username"],
    email: req.body["email"],
    password: req.body["password"],
    invite: req.query.r,
  };

  /*
  Checking if invite is valid. so if valid record it, if not register the user without invite
  */
  let isInviteValid = await checkUsername(user.invite);
  let isUsernameValid = await checkUsername(user.username);
  let isEmailValid = await checkEmail(user.email);

  if (isInviteValid) {
    if (isEmailValid || isUsernameValid) {
      user.email = isEmailValid ? "" : user.email;
      user.username = isUsernameValid ? "" : user.username;
      // console.log(user);
      // this is the person that owns the referral link
      let invitee = user.invite;
      res.render("register", { invitee, isSignup: true, user });
    } else {
      // record invite
      let feedBack = await insertUser(user);
      let isInviteRecorded = await insertInvite(user.invite, feedBack.ID)
      let ID = await getUserID(user.invite)
      
      // transaction Record
      let transactionRecord = await Transaction(ID, 1, "Credit", "Referral")
      // Output data received
      console.log(isInviteRecorded);

      if (feedBack.status) {
        res.cookie("ID", feedBack.ID, {
          maxAge: 900000,
          httpOnly: true,
          secure: false,
        }); 
        res.redirect("dashboard");
      } else {
        res.send("Can't add record");
      }
    }
  } else {
    if (isEmailValid || isUsernameValid) {
      user.email = isEmailValid ? "" : user.email;
      user.username = isUsernameValid ? "" : user.username;
      // console.log(user);
      // this is the person that owns the referral link
      let invitee = req.query.r || "null";
      res.render("register", { invitee, isSignup: true, user });
    } else {
      let feedBack = await insertUser(user);
      if (feedBack.status) {
        res.cookie("ID", feedBack.ID, {
          maxAge: 900000,
          httpOnly: true,
          secure: false,
        });
        res.redirect("dashboard");
      } else {
        res.send("Can't add record");
      }
    }
  }
});
module.exports = router;
