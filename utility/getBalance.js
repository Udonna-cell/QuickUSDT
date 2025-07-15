const Database = require("./database");
const { Balance } = require("./transaction");

async function getBalance(username) {
  const DB = new Database()
  let ID;
  try {
    let { results } = await DB.query('SELECT `ID` FROM `users` WHERE `username`=?',[username])
    results = JSON.parse(JSON.stringify(results))[0].ID;
    ID = results
    return await Balance(ID)
  } catch (err) {
    console.error('Error:', err);
    return 0.00
  }
}

module.exports = {
    getBalance
}