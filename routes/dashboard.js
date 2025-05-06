const express = require("express");
const Database = require("../utility/database");
const compile = require("../utility/scssCompile");
const router = express.Router();

router.get("/", async (req, res) => {
  compile();
  let DB = new Database();
  let ID = req.cookies.ID;
  let user;
  try {
    user = await DB.query("SELECT * FROM users WHERE ID = ?", [ID]);
    if (user.results.length == 0) {
      res.redirect("/signin");
    } else {
      user = JSON.parse(JSON.stringify(user.results));
      user = user[0];
    }
  } catch (error) {
    console.log(error);
  }
  res.render("dashboard", { user });
});

module.exports = router;
