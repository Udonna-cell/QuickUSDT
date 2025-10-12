
const express = require("express");
const router = express.Router();
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const { referrals } = require("../../utility/referrals.js");
const Database = require("../../utility/database");

const compile = require('../../utility/scssCompile.js');
const {
  isBonusClaimed,
  isUserActive,
  setNextClaim,
  getBonus,
} = require("../../utility/cookies/bonus");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  const DB = new Database()
  let isBonusSet;
  let userBonus;

  let ID = req.cookies.ID;
  try {
    isBonusSet = await isBonusClaimed(ID);
    userBonus = await getBonus(ID);
    const isUserInactive = userBonus.length == 0;
    userBonus = await setNextClaim(userBonus[0], isUserInactive, ID);
    userBonus.day = userBonus.day == undefined? 1 : userBonus.day
  }catch (err) {
    console.error('Error:', err);
    console.log("Can't get user Bonus for ID", ID);
  }
  
  

  const filePath = path.join(__dirname, '../../views/daily-bonus.pug');
  const pageFn = pug.compileFile(filePath);
  let pageHtml = pageFn({ ID, isBonusSet, userBonus }); // pass data to pug template if needed
  console.log("Bonus >>>",{ ID, isBonusSet, userBonus })
  res.json({ page: pageHtml });
})

module.exports = router;

