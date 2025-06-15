const Database = require("../database");


// Helper function to generate a random user ID (e.g., 8 characters long)
async function getEvents() {
  let DB = new Database
  try {
    let { results } = await DB.query("SELECT * FROM `events`");
    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.log(error);
    return []
  }
}

module.exports = {
    getEvents
}