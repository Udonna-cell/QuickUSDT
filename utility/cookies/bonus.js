require("dotenv").config();
const Database = require("../database");
const { currentTime, compareTime } = require("../date");

async function setBonus({ userID, reward, count, streak, date }) {
  const DB = new Database();
  try {
    const result = await DB.query(
      "INSERT INTO `bonus`(`userID`, `reward`, `count`, `streak`, `date`) VALUES (?, ?, ?, ?, ?);",
      [userID, reward, count, streak, date]
    );
    await DB.query(
      "INSERT INTO `transactions`(`ID`, `amount`, `type`, `flag`, `date`) VALUES (?, ?, ?, ?, ?)",
      [userID, reward, "Credit", "Bonus", date]
    );
    return { status: result.success, ID: userID };
  } catch (error) {
    // console.error("Error in setBonus:", error);
    return { status: false, ID: userID };
  }
}

// These logic is called to set that a logic is claim or claim if not claimed
async function claimBonus({ ID }) {
  const DB = new Database();

  // this get that user ID in the bonus table
  const getUserBonus = await getBonus(ID);

  // this check if the user is present in the bonus table
  const isActive = getUserBonus.length > 0;
  // console.log(isActive, ">><<<");

  const { userID, reward, count, streak, date } = await setNextClaim(
    getUserBonus[0],
    !isActive,
    ID
  );

  // console.log("claim ID", { userID, reward, count, streak, date });

  if (isActive) {
    try {
      await DB.query(
        "UPDATE `bonus` SET `reward`= ?, `count`= ?, `streak`= ?, `date`= ? WHERE `userID`= ?",
        [reward, count, streak, date, userID]
      );
      await DB.query(
        "INSERT INTO `transactions`(`ID`, `amount`, `type`, `flag`, `date`) VALUES (?, ?, ?, ?, ?)",
        [ID, reward, "Credit", "Bonus", date]
      );

      const resultRaw = await DB.query(
        "SELECT * FROM `bonus` WHERE `userID` = ?",
        [userID]
      );
      const result = JSON.parse(JSON.stringify(resultRaw.results))[0];

      return { result, status: true, ID };
    } catch (error) {
      // console.error("Error updating bonus:", error);
      return { result: null, status: false, ID };
    }
  } else {
    return await setBonus({ userID, reward, count, streak, date });
  }
}

// this is to check if the user has claimed the current day bonus ---> boolean
async function isBonusClaimed(userID) {
  const DB = new Database();
  const now = currentTime().YMD;

  try {
    let { results } = await DB.query(
      "SELECT date FROM `bonus` WHERE `userID`=?",
      [userID]
    );
    if (results.length == 0) {
      return false;
    }
    results = JSON.parse(JSON.stringify(results))[0].date;
    let T = new Date(results)
    
    // console.log("Have user claimed today bonus", T == now);
    return (T.getFullYear() == now.getFullYear() && T.getMonth() == now.getMonth() && T.getDate() == now.getDate()) ? true : false;
  } catch (error) {
    // console.log(error);
    return false;
  }
}

async function isUserActive(userID) {
  const DB = new Database();
  try {
    const result = await DB.query("SELECT * FROM `bonus` WHERE `userID` = ?", [
      userID,
    ]);
    return JSON.parse(JSON.stringify(result.results)).length > 0;
  } catch (error) {
    // console.error("Error in isUserActive:", error);
    return false;
  }
}

async function setNextClaim(record, isUserInactive, id) {
  const { Y, M, D, now } = currentTime();
  console.log("records data", record);

  // for users that has not claim bonus before
  if (isUserInactive) {
    // console.log("User has not claimed bonus before");
    let nextClaim = {
      userID: id,
      reward: Number(process.env.AMOUNT),
      count: 1,
      streak: 1,
      date: now,
    };
    return nextClaim;
  }
  // console.log("User has claimed bonus before");
  let nextClaim = {
    userID: record.userID,
    reward: Number(process.env.AMOUNT),
    count: record.count,
    streak: record.streak,
    date: now,
  };
  // checking if the claim record is frequent

  let onTrack = compareTime(record.date, nextClaim.date).onTrack;

  // console.log("On track",onTrack);

  if (onTrack) {
    nextClaim.count += 1;
    if (nextClaim.count > nextClaim.streak) {
      nextClaim.streak = nextClaim.count;
    }
  } else {
    nextClaim.count = 1;
  }

  const multiplier = nextClaim.count % 7 === 0 ? 7 : nextClaim.count % 7;
  nextClaim.reward = nextClaim.reward * multiplier;
  nextClaim.day = multiplier;
  // nextClaim.date = now;

  return nextClaim;
}

// These logic gets the bonus from the bonus table of a particular user ID
async function getBonus(ID) {
  const DB = new Database();
  try {
    const { results } = await DB.query(
      "SELECT * FROM `bonus` WHERE userID = ?",
      [ID]
    );
    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    // console.log("=================NO BONUS AVAILABLE ======================");
    // console.log(error);
    // console.log("=======================================");
    return [];
  }
}

module.exports = {
  setBonus,
  isBonusClaimed,
  isUserActive,
  claimBonus,
  getBonus,
  setNextClaim,
};
