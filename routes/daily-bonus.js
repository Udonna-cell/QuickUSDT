require("dotenv").config();
const express = require("express");
const router = express.Router();
// const { API } = require("faucetpayjs");
// const myAPI = new API(process.env.API_KEY);
const compile = require("../utility/scssCompile.js");
const { insertBonus } = require("../utility/database/insert.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  let date = new Date();
  date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let info = {
    ID: req.cookies.ID,
    reward: 0.008,
    date,
  };
  let g = await insertBonus(info);
  console.log(g);
  res.json({ age: 78 });
});

module.exports = router;
