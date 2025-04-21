require("dotenv").config();
const { API } = require("FaucetPayJS");
const myAPI = new API(process.env.API_KEY);
const DataBase = require("./database/index")

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "db4free.net",
  user: "stabug",
  password: "456ma$SO",
  database: "greydb",
});

function payment(address) {
  connection.connect((e) => {
    if (e) throw e;

    connection.query(
      `SELECT * FROM quickUSDT WHERE address="${address}"`,
      function (error, results, fields) {
        if (error) throw error;
        let timeLeft =
          new Date().getTime() - new Date(results[0].time).getTime();
        if (timeLeft > 0) {
          myAPI.send(100000, address, "USDT").then((d) => {
            if (d.status == 200) {
              connection.query(
                `INSERT INTO quickUSDT (id, address, amount, time) VALUES ('2', '${address}', '0.001', NOW());`,
                (err) => {
                  if (err) {
                    console.log("can't add to db");
                  }
                  console.log("added successfully :)");
                //   connection.end()
                }
              );
            } else {
            }
            console.log(d.status);
          });
        } else {
        }
        //   console.log("The solution is: ", results);
        //   console.log(timeLeft);
        connection.end()
      }
    );

  });
}

payment("stabug6@gmail.com");
