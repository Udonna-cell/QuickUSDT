const express =  require("express")
// const sass = require("sass");
// const fs = require("fs");
// const path = require("path");
const router = express.Router();
// const Database = require("../utility/database/index.js");
// const { LOCAL, GLOBAL } = require("../utility/database/key.js");
const compile = require("../utility/scssCompile.js")

/* GET home page. */
router.get("/", async function (req, res, next) {
    // Compiling scss file to css for development
    compile()
    // this is the person that owns the referral link
    let invitee = req.query.r || "null"
    console.log(invitee);

    res.render("register", {invitee, isSignup: true})
})
router.post("/", async function (req, res, next) {
    res.send("Received data")
})
module.exports = router;