const express = require("express");
const router = express.Router();
const compile = require("../utility/scssCompile.js");
// const { checkEmail } = require("../utility/database/checkExist.js");
// const { checkMatch } = require("../utility/database/checkMatchPassword.js");
// const Database = require("../utility/database/index.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();
  let ID = req.cookies.ID;
  res.cookie("ID", "", {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });
  res.redirect("/dashboard");
})


module.exports = router;