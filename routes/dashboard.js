const express = require("express");
const Database = require("../utility/database");
const compile = require("../utility/scssCompile");
const { getEvents } = require("../utility/events/getEvents");
const { Balance } = require("../utility/transaction");
const { getBalance } = require("../utility/getBalance");
const Tabs = require("../utility/tabs.json")
const router = express.Router();
// const { initBonus } = require("../utility/cookies/bonus")

router.get("/", async (req, res) => {
  console.log(Tabs);
  // console.log(await getBalance("orabueze"));
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
    
    // let invite = await referrals(user.username);
    res.render("dashboard", {
      user,
      events,
      isEventEmpty,
      balance,
      // invite,
      tabs: Tabs
    });
  }
});

module.exports = router;
