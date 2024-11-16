require("dotenv").config();
const express = require("express");
const sass = require("sass");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { API } = require("faucetpayjs");
const myAPI = new API(process.env.API_KEY);
// const query = require("../utility/database/index.js")
const mysql = require("mysql");



/* GET home page. */
router.get("/", async function (req, res, next) {
  let style = sass.compile(path.resolve(__dirname, "../sass/style.scss"));

  fs.writeFileSync(
    path.resolve(__dirname, "../public/stylesheets/style.css"),
    style.css
  );
  
  const connection = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "",
    database: "test",
  });
  connection.connect();

  connection.query(
    'SELECT * FROM `transactions` ORDER BY time DESC;',
    async function (error, results, fields) {
      if (error) {
        console.log("An error occur :(");
      } else {
        let payouts = JSON.stringify(results);
        payouts = JSON.parse(payouts);
        payouts.forEach((pay) => {
          pay.time = pay.time.split(".")[0];
          pay.time = pay.time.replace("T", " ");
          // pay.time = pay.time.replaceAll(":", "/");
        });

        let Balance
        try {
          Balance = await myAPI.getBalance("USDT");
          Balance = Balance.balance * Math.pow(10, -8);
        } catch (e) {
          Balance = NaN
        }


        let data = {
          title: "QuickUSDT",
          motive: "high paying QuickUSDT pay on faucetpay.io",
          walletBalance: `[USDT] Balance: ${Balance} `,
          claim: `0.0010 USDT every 1 minutes.`,
          reward: 0.001,
          payouts,
        };
        // console.log(payouts);
        res.render("index", data);
      }
    }
  )

  connection.end();

});

module.exports = router;