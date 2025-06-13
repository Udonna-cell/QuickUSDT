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
  
  // Testing bonus table if exist
  try {
    let results = await db.query("SELECT * FROM `bonus`")
  } catch (error) {
    console.log(error.message);
    createBonusTable()
  }

  // Testing events table 
  try {
    await db.query("SELECT * FROM `events`")
  } catch (error) {
    createEventsTable()
  }

  // Testing invite table 
  try {
    await db.query("SELECT * FROM `invite`")
  } catch (error) {
    createInviteTable()
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
async function createBonusTable() {
  let query = fs.readFileSync(path.resolve(__dirname,"./query/bonus.sql"),{encoding: "utf8"})
  let db = new Database()
  try {
    let results =  await db.query(query)
    console.log(results.success);
  } catch (error) {
    console.log(error);
  }
}
async function createEventsTable() {
  let query = fs.readFileSync(path.resolve(__dirname,"./query/events.sql"),{encoding: "utf8"})
  let db = new Database()
  try {
    let results =  await db.query(query)
    console.log(results.success);
  } catch (error) {
    console.log(error);
  }
}
async function createInviteTable() {
  let query = fs.readFileSync(path.resolve(__dirname,"./query/invite.sql"),{encoding: "utf8"})
  let db = new Database()
  try {
    let results =  await db.query(query)
    console.log(results.success);
  } catch (error) {
    console.log(error);
  }
}


module.exports = Init