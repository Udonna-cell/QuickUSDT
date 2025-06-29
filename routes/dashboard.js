const express = require("express");
const Database = require("../utility/database");
const compile = require("../utility/scssCompile");
const {
  isBonusClaimed,
  isUserActive,
  setNextClaim,
  getBonus,
} = require("../utility/cookies/bonus");
const { getEvents } = require("../utility/events/getEvents");
const { Balance } = require("../utility/transaction");
const router = express.Router();
// const { initBonus } = require("../utility/cookies/bonus")

router.get("/", async (req, res) => {
  // global
  let DB = new Database();
  let ID = req.cookies.ID;
  let events = await getEvents();
  let isEventEmpty = events.length == 0 ? true : false;
  let user;
  

  // console.log("user ID",ID);
  if (!ID) {
    res.redirect("/signin");
  } else {
    let balance = await Balance(ID)
    // check if bonus cookie is set
    let isBonusSet = await isBonusClaimed(ID);
    let userBonus = await getBonus(ID);
    const isUserInactive = userBonus.length == 0;
    // console.log("user bonus record",userBonus);
    userBonus = await setNextClaim(userBonus[0], isUserInactive, ID);
    // console.log(events, " >>>> received Event <<<<<<");
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
      // console.log(error);
    }

    // console.log("hellllllloooooooo!!!!!!!!!!!!!!!!");
    // console.log("is bonus claim today", isBonusSet);
    // console.log(userBonus);
    res.render("dashboard", {
      user,
      isBonusSet,
      userBonus,
      events,
      isEventEmpty,
      balance
    });
  }
});

module.exports = router;
