const { generateUserId } = require("../generateID");
const Database = require("./index");

async function insertUser({ firstName, lastName, username, email, password }) {
  let db = new Database();
  let ID = await generateUserId(8);
  try {
    let result = await db.query(
      "INSERT INTO `users` (`ID`,`email`, `username`, `first-name`, `last-name`, `password`) VALUES (?, ? , ?, ?, ?, ?);",
      [ID, email, username, firstName, lastName, password]
    );
    return {
      status: result.success,
      ID,
    };
  } catch (error) {
    console.log(error);
  }
}
async function insertBonus({ ID, reward, date }) {
  let db = new Database();
  // let ID = await generateUserId(8);
  try {
    let result = await db.query(
      "INSERT INTO `bonus`(`userID`, `reward`, `date`) VALUES (?,?,?)",
      [ID, reward, date]
    );
    return {
      status: result.success,
      ID,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { insertUser, insertBonus };
