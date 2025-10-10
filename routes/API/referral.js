
const express = require("express");
const router = express.Router();
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const { referrals } = require("../../utility/referrals.js");
const Database = require("../../utility/database");

const compile = require('../../utility/scssCompile.js');

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  const DB = new Database()
  let user;

  let ID = req.cookies.ID;
  try {
    let { results } = await DB.query("SELECT * FROM users WHERE ID = ?", [ID]);
    user = JSON.parse(JSON.stringify(results))[0];
  } catch (err) {
    console.error('Error:', err);
    console.log("Can't get user from ID");
  }

  console.log(user)
  let invite = await referrals(user.username);

  const filePath = path.join(__dirname, '../../views/includes/referral.pug');
  const pageFn = pug.compileFile(filePath);
  let pageHtml = pageFn({ ID, invite }); // pass data to pug template if needed
  console.log({ invite });
  res.json({ page: pageHtml });
})

module.exports = router;

