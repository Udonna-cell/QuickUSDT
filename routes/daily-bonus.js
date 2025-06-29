require("dotenv").config();
const express = require("express");
const router = express.Router();
// const { API } = require("faucetpayjs");
// const myAPI = new API(process.env.API_KEY);
const compile = require("../utility/scssCompile.js");
const { insertBonus } = require("../utility/database/insert.js");
const { claimBonus } = require("../utility/cookies/bonus.js");
const { Balance } = require("../utility/transaction.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  

  let info = {
    ID: req.cookies.ID,
    amount: 0.008,
    type: "credit",
    flag: "Bonus",
  };

  console.log("Claim start");
  console.log(info);
  let claim = await claimBonus(info);
  let balance = await Balance(info.ID)
  console.log(claim, "<< claim <<<");
  res.json({status: claim.status, balance, claim});
});

module.exports = router;
