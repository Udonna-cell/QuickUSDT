const Database = require("./index");

async function checkMatch(data, record) {
  let db = new Database();
  try {
    let { results } = await db.query(
      "SELECT * FROM `users` WHERE password = ? AND email = ?",
      [data, record]
    );

    return results.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  checkMatch,
};
