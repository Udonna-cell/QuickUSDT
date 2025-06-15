require("dotenv").config();
const express = require("express");
const router = express.Router();
// const { API } = require("faucetpayjs");
// const myAPI = new API(process.env.API_KEY);
const compile = require("../utility/scssCompile.js");
const { insertBonus } = require("../utility/database/insert.js");
const { claimBonus } = require("../utility/cookies/bonus.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  let now = new Date();
  let M = (now.getMonth() + 1 < 10)? "0" + (now.getMonth() + 1) : now.getMonth() + 1

  let D = (now.getDate() < 10)? "0" + (now.getDate()) : now.getDate()
  now = `${now.getFullYear()}-${M}-${D}`;

  let info = {
    ID: req.cookies.ID,
    current: now
  };

  console.log("Claim start");
  let claim = await claimBonus(info)
  console.log(claim, "<< claim <<<");
  res.json(claim);
});

module.exports = router;
