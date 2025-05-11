require("dotenv").config();
const express = require("express");
const router = express.Router();
// const { API } = require("faucetpayjs");
// const myAPI = new API(process.env.API_KEY);
const compile = require("../utility/scssCompile.js")

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile()
  res.render("daily-bonus")
});

module.exports = router;