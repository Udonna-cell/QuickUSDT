const Database = require("./database");

// Helper function to generate a random user ID (e.g., 8 characters long)
async function generateUserId(length) {
  let isDone = false
  let ID;
  while (!isDone) {
    ID = generateID(length)
    isDone = await checkIfExist(ID)
  }
  return ID
}

async function checkIfExist(ID) {
  const DB = new Database();
  try {
    let result = await DB.query("SELECT ID FROM users WHERE ID = ?", [ID])
    console.log(result);
    console.log(`ID do exist ${ID}`);
    return true
  } catch (error) {
    console.log(error);
    console.log(`ID does not exist ${ID}`);
    return false
  }
}

function generateID(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomStr = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomIndex];
  }
  return randomStr;
}

module.exports = { generateUserId };
