const express =  require("express")
const router = express.Router();
// const Database = require("../utility/database/index.js");
// const { LOCAL, GLOBAL } = require("../utility/database/key.js");
const compile = require("../utility/scssCompile.js")

/* GET home page. */
router.get("/", async function (req, res, next) {
    // Compiling scss file to css for development
    compile()

    res.render("register", {isSignup: false})
})
router.post("/", async function (req, res, next) {
    res.send("Received data")
})
module.exports = router;