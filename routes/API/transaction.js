const express = require("express");
const router = express.Router();
const pug = require('pug');
const path = require('path');
const fs = require('fs');

const compile = require('../../utility/scssCompile.js');

/* GET home page. */
router.get("/", async function (req, res, next) {
  // Compiling scss file to css for development
  compile();


  let ID = req.cookies.ID;



  const filePath = path.join(__dirname, '../../views/includes/transaction.pug');
  const pageFn = pug.compileFile(filePath);
  let pageHtml = pageFn({ ID }); // pass data to pug template if needed

  res.json({ page: pageHtml });
})


module.exports = router;