const Database = require("./index");

async function checkPassword(params) {}
async function checkUsername(params) {
  let db = new Database();
  try {
    let obtain = await db.query("SELECT * FROM `users` WHERE username = ?", [
      params,
    ]);
    return obtain.results.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function checkLastName(params) {}
async function checkFirstName(params) {}
async function checkEmail(params) {
  let db = new Database();
  try {
    let obtain = await db.query("SELECT * FROM `users` WHERE email = ?", [
      params,
    ]);

    return obtain.results.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  checkEmail,
  checkFirstName,
  checkPassword,
  checkUsername,
  checkLastName,
};
