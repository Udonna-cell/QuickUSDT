require("dotenv").config();
const express = require("express");
const sass = require("sass");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { API } = require("FaucetPayJS");
const myAPI = new API(process.env.API_KEY);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "db4free.net",
  user: "stabug",
  password: "456ma$SO",
  database: "greydb",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  connection.connect();

  connection.query(
    "SELECT * FROM quickUSDT",
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

        let style = sass.compile(path.resolve(__dirname, "../sass/style.scss"));

        fs.writeFileSync(
          path.resolve(__dirname, "../public/stylesheets/style.css"),
          style.css
        );

        let Balance = await myAPI.getBalance("USDT");
        Balance = Balance.balance * Math.pow(10, -8);

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
  );

  connection.end();
});

module.exports = router;
