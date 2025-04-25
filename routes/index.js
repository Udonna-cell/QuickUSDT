require("dotenv").config();
const express = require("express");
// const sass = require("sass");
// const fs = require("fs");
// const path = require("path");
const router = express.Router();
// const { API } = require("faucetpayjs");
// const myAPI = new API(process.env.API_KEY);
const Database = require("../utility/database/index.js");
const compile = require("../utility/scssCompile.js")

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile()

  
  res.redirect("/register")
});

module.exports = router;
