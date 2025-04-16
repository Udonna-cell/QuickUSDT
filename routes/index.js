require("dotenv").config();
const express = require("express");
const sass = require("sass");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { API } = require("faucetpayjs");
const myAPI = new API(process.env.API_KEY);
const Database = require("../utility/database/index.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  let style = sass.compile(path.resolve(__dirname, "../sass/style.scss"));

  fs.writeFileSync(
    path.resolve(__dirname, "../public/stylesheets/style.css"),
    style.css
  );
  let db = new Database();

  try {
    const conStatus = await db.checkConnection();
    console.log(conStatus);

    const sendQuery = await db.query(
      "SELECT * FROM `transactions` ORDER BY time DESC;"
    );
    if (sendQuery.success) {
      let payouts = JSON.stringify(sendQuery.results);
      payouts = JSON.parse(payouts);
      payouts.forEach((pay) => {
        pay.time = pay.time.split(".")[0];
        pay.time = pay.time.replace("T", " ");
        // pay.time = pay.time.replaceAll(":", "/");
      });

      let Balance;
      try {
        Balance = await myAPI.getBalance("USDT");
        Balance = Balance.balance * Math.pow(10, -8);
      } catch (e) {
        Balance = NaN;
      }

      let reward = process.env.AMOUNT * Math.pow(10, -8);
      console.log(reward);
      let data = {
        title: "QuickUSDT",
        motive: "high paying QuickUSDT pay on faucetpay.io",
        walletBalance: `[USDT] Balance: ${Balance} `,
        claim: `${reward} USDT every 30 minutes.`,
        reward,
        payouts,
      };
      // console.log(payouts);
      res.render("index", data);
    } else {
      console.log(sendQuery.message);
    }

    const closeStatus = await db.close();
    console.log(closeStatus);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
