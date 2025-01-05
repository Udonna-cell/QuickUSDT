const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { API } = require("faucetpayjs");
const myAPI = new API(process.env.API_KEY);

/* POST users listing. */
router.post("/", function (req, res, next) {
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
        "SELECT * FROM `transactions` WHERE address = ? ORDER BY time DESC LIMIT 1;",
        [address],
        (error, results) => {
          if (error) {
            console.error("Query error:", error);
            return res
              .status(500)
              .json({ status: false, message: "Database query failed" });
          }

          const now = new Date();
          const THIRTY_MINUTES = 30; // Define the wait time in minutes
          const claimAmount = process.env.AMOUNT * Math.pow(10, -8); // Convert to appropriate amount

          if (results.length > 0) {
            const lastClaimed = new Date(results[0].time);
            const minutesSinceLastClaim = (now - lastClaimed) / (1000 * 60);

            if (minutesSinceLastClaim > THIRTY_MINUTES) {
              // User is eligible to claim
              connection.query(
                "INSERT INTO `transactions` (`address`, `amount`) VALUES (?, ?)",
                [address, claimAmount],
                (insertError) => {
                  if (insertError) {
                    console.error("Insert error:", insertError);
                    return res.json({
                      status: false,
                      message: "Failed to record the claim",
                    });
                  }

                  console.log("New claim recorded successfully.");
                  myAPI
                    .send(process.env.AMOUNT, address, "USDT", false)
                    .then((response) => {
                      console.log("Reward sent:", response);
                      res.json({
                        status: true,
                        message: "Reward sent and recorded",
                      });
                    })
                    .catch((sendError) => {
                      console.error("Failed to send reward:", sendError);
                      res.json({ status: false, message: "Reward not sent" });
                    });
                }
              );
            } else {
              // User must wait longer
              const timeRemaining = Math.ceil(
                THIRTY_MINUTES - minutesSinceLastClaim
              );
              console.log(`User must wait ${timeRemaining} more minutes.`);
              res.json({
                status: false,
                message: `Please wait ${timeRemaining} more minutes to claim.`,
              });
            }
          } else {
            // New user - allow immediate claim
            connection.query(
              "INSERT INTO `transactions` (`address`, `amount`) VALUES (?, ?)",
              [address, claimAmount],
              (insertError) => {
                if (insertError) {
                  console.error("Insert error:", insertError);
                  return res.json({
                    status: false,
                    message: "Failed to record the new user claim",
                  });
                }

                console.log("New user claim recorded successfully.");
                myAPI
                  .send(process.env.AMOUNT, address, "USDT", false)
                  .then((response) => {
                    console.log("Reward sent:", response);
                    res.json({
                      status: true,
                      message: "Reward sent and recorded",
                    });
                  })
                  .catch((sendError) => {
                    console.error("Failed to send reward:", sendError);
                    res.json({ status: false, message: "Reward not sent" });
                  });
              }
            );
          }

          // Ensure the connection is closed
          connection.end((endError) => {
            if (endError) {
              console.error("Error closing connection:", endError);
            }
          });
        }
      );
    }
  });
});

module.exports = router;
