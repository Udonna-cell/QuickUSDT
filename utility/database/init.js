const Database = require("./index.js");
const { LOCAL, GLOBAL } = require("./key.js");
const fs = require("fs")
const path = require("path")

// The Init function will config a connection to the database
async function Init() {
  const db = new Database(GLOBAL);
  // check connection to local host if faild switch to Global key
  try {
    let isConnected = await db.checkConnection();
    console.log(isConnected.message);
  } catch (error) {
    console.log("failed to connect to Global");
    try {
      db.connection = LOCAL;
      let isConnected = await db.checkConnection();
      console.log("LOCAL " + isConnected.message);
    } catch (error) {
      console.log("Failed to connect to LOCAl");
    }
  }

  // Testing for existing tables
  try {
    let results = await db.query("SELECT * FROM `users`")
  } catch (error) {
    console.log(error.message);
    createUserTable()
  }
}

async function createUserTable() {
  let query = fs.readFileSync(path.resolve(__dirname,"./query/createTable.sql"),{encoding: "utf8"})
  let db = new Database()
  try {
    let results =  await db.query(query)
    console.log(results.success);
  } catch (error) {
    console.log(error);
  }
}

module.exports = Init