require("dotenv").config();
const express = require("express");
// const sass = require("sass");
// const fs = require("fs");
// const path = require("path");
const router = express.Router();
// const { API } = require("faucetpayjs");
// const myAPI = new API(process.env.API_KEY);
const Database = require("../utility/database/index.js");
const { LOCAL, GLOBAL } = require("../utility/database/key.js");
const compile = require("../utility/scssCompile.js")

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile()

  const db = new Database(GLOBAL);
  // check connection to local host if faild switch to Global key
  try {
    let isConnected = await db.checkConnection();
    console.log(isConnected.message);
  } catch (error) {
    console.log("failed to connect to Global");
    try {
      db.connection = LOCAL;
      let isConnected = await db.checkConnection();
      console.log("LOCAL "  + isConnected.message);
    } catch (error) {
      console.log("Failed to connect to LOCAl");
    }
  }
  res.redirect("/register")
});

module.exports = router;
