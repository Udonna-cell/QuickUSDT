const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const { API } = require('faucetpayjs');
const myAPI = new API(process.env.API_KEY);


/* POST users listing. */
router.post('/', function (req, res, next) {
  // Extract the 'address' from the request body
  let { address } = req.body;
  let result = { address };

  // Create a connection to the MySQL database
  const connection = mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "admin",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || "test",
  });

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.log("Connection error: " + err);
      return res.status(500).json({ error: "Database connection failed" });
    } else {
      // Query the database to check if the user with the given address exists
      connection.query(
        'SELECT * FROM `transactions` WHERE address = ? ORDER BY time DESC;',
        [address],
        (error, results) => {
          if (error) {
            console.log("Query error: " + error);
            return res.status(500).json({ error: "Database query failed" });
          }

          // If the user exists in the database
          if (results.length > 0) {
            // Get the time when the user last claimed (in 'time' column)
            let claimed = new Date(results[0].time);

            // Get the current time
            let now = new Date();
            let timeDifference = now - claimed; // Difference in milliseconds

            // Convert the difference into minutes
            let minutesWaited = timeDifference / (1000 * 60); // milliseconds to minutes

            console.log(minutesWaited);
            // Check if the user has waited more than 30 minutes
            if (minutesWaited > 30) {
              console.log("User has waited more than 30 minutes.");

              // If so, insert a new record into the database (claim)
              connection.query(
                "INSERT INTO `transactions` ( `address`, `amount`) VALUES (?, ?)",
                [ address, (process.env.AMOUNT * Math.pow(10, -8))], // Here, the placeholder '?' will be replaced by actual values
                (insertError) => {
                  if (insertError) {
                    console.log("Failed to insert data: " + insertError);
                    res.json({
                      status: false,
                      message: "no reward sent and unrecorded"
                    });
                    return res.status(500).json({ error: "Failed to insert new claim" });
                  } else {
                    console.log("Successfully added new claim info.");
                    myAPI.send(process.env.AMOUNT,address,"USDT",false).then(d=>{
                      console.dir(d);
                      
                    })
                    res.json({
                      status: true,
                      message: "reward sent and recorded"
                    });
                  }
                }
              );
            } else {
              console.log("User has not yet waited 30 minutes.");
            }
          } else {
            console.log("address not found");
            // If the user doesn't exist in the database, create a new record
            connection.query(
              "INSERT INTO `transactions` (`address`, `amount`) VALUES (?, ?)",
              [address, (process.env.AMOUNT * Math.pow(10, -8))], // Insert a new claim record for the user
              (insertError) => {
                if (insertError) {
                  console.log("Failed to insert data: " + insertError);
                  return res.status(500).json({ error: "Failed to insert new user claim" });
                } else {
                  console.log("Successfully added new user claim.");
                  myAPI.send(process.env.AMOUNT,address,"USDT",false).then(d=>{
                      console.dir(d);
                      
                    })
                  res.json({
                      status: true,
                      message: "reward sent and recorded"
                    });
                }
              }
            );
          }

          // Close the database connection after the operation
          connection.end((endError) => {
            if (endError) {
              console.log("Error closing connection: " + endError);
            }
          });

          // Send a JSON response with the user address (or additional data if needed)
          
        }
      );
    }
  });
});

module.exports = router;
