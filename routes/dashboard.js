const express = require("express");
const Database = require("../utility/database");
const compile = require("../utility/scssCompile");
const { isBonusClaimed, isUserActive, getBonus } = require("../utility/cookies/bonus");
const router = express.Router();
// const { initBonus } = require("../utility/cookies/bonus")

router.get("/", async (req, res) => {
  // global
  let DB = new Database();
  let ID = req.cookies.ID;
  let user;

  // check if bonus cookie is set
  let isBonusSet = await isBonusClaimed(ID);
  let userBonus = await getBonus(ID)
  console.log(userBonus, " >>>> received <<<<<<");
  // isBonusSet = isBonusSet ? true : false;
  // let totalBonusClaimed = [];
  // let active = await isUserActive(ID)
  // console.log(active , ">>>> active user <<<<<");

  compile();

  try {
    user = await DB.query("SELECT * FROM users WHERE ID = ?", [ID]);

    if (user.results.length == 0) {
      res.redirect("/signin");
    } else {
      user = JSON.parse(JSON.stringify(user.results));
      user = user[0];
    }
  } catch (error) {
    console.log(error);
  }
  res.render("dashboard", { user, isBonusSet, userBonus });
});

module.exports = router;
