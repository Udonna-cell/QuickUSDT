require("dotenv").config();
const Database = require("../database");
const { currentTime, compareTime } = require("../date");
const { Transaction } = require("../transaction.js");



// Claims and updates the bonus	{ status, result, message }
async function claimBonus({ ID }) {

  if (await isBonusClaimed(ID)) {
    return { result: null, status: false, ID };
  }
  const DB = new Database();

  // this get that user ID in the bonus table
  const getUserBonus = await getBonus(ID);

  // this check if the user is present in the bonus table
  const isActive = getUserBonus.length > 0;
  // console.log(isActive, ">><<<");

  const { userID, reward, count, streak, date } = await computeNextClaim( ID );

  // console.log("claim ID", { userID, reward, count, streak, date });

  if (isActive) {
    try {
      await DB.query(
        "UPDATE `bonus` SET `reward`= ?, `count`= ?, `streak`= ?, `date`= ? WHERE `userID`= ?",
        [reward, count, streak, date, userID]
      );
      await Transaction(ID, reward, "Credit", "Bonus")
      // await DB.query(
      //   "INSERT INTO `transactions`(`ID`, `amount`, `type`, `flag`, `date`) VALUES (?, ?, ?, ?, ?)",
      //   [ID, reward, "Credit", "Bonus", date]
      // );

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

// Calculates what the next reward will be	Object with { userID, reward, count, streak, date }
async function computeNextClaim(id) {
  const { Y, M, D, now } = currentTime();
  // get next record if user is on the table 
  const record = (await getBonus(id))[0]
  const { diffDays } = currentTime(record? record.date : `${D}:${M-1}:${Y}`)

  // if user has claimed today
  console.log(diffDays, "days past");
  if (diffDays == 0) {
    return record
  }
    // set next claim to default if user is not on the bonus table or haven't claim over a day
  if (!(await isUserActive) || diffDays > 1) {
    let nextClaim = {
      userID: id,
      reward: Number(process.env.AMOUNT),
      count: 1,
      streak: 1,
      date: now,
    };
    return nextClaim;
  }
  
  // console.log("stabug6 >>>", record.date);
  let nextClaim = {
    userID: record.userID,
    reward: Number(process.env.AMOUNT),
    count: record.count,
    streak: record.streak,
    date: now,
  };
  // checking if the claim record is frequent
  let onTrack = compareTime(record.date, nextClaim.date).onTrack;
  if (onTrack) {
    nextClaim.count += 1;
    if (nextClaim.count > nextClaim.streak) {
      nextClaim.streak = nextClaim.count;
    }
  } else {
    // nextClaim.count = 1;
    return record
  }

  const multiplier = nextClaim.count % 7 === 0 ? 7 : nextClaim.count % 7;
  nextClaim.reward = nextClaim.reward * multiplier;
  nextClaim.day = multiplier;
  nextClaim.count = multiplier;
  nextClaim.date = now;

  return nextClaim;
}

// Creates a new bonus record for new users	{ status, ID }
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
    return { status: false, ID: userID };
  }
}

// Checks if the user already claimed today	true / false
async function isBonusClaimed(userID) {
  try {
    let results = await getBonus(userID);
    if (results.length == 0) {
      return false;
    }
    results = results[0].date;
    console.log(results);
    let T = new Date(results)
    const timeRemain = currentTime(T).diffDays;
    // console.log(timeRemain, "time remaining");
    return (diffDays <= 0)
  } catch (error) {
    return false;
  }
}

// Checks if the user exists in the bonus table	true / false
async function isUserActive(userID) {
  try {
    const result = await getBonus(userID);
    return result.length > 0;
  } catch (error) {
    return false;
  }
}

// Fetches the user’s bonus record	Array of bonus records
async function getBonus(ID) {
  const DB = new Database();
  try {
    const { results } = await DB.query(
      "SELECT * FROM `bonus` WHERE userID = ?",
      [ID]
    );
    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    return [];
  }
}

module.exports = {
  setBonus,
  isBonusClaimed,
  isUserActive,
  claimBonus,
  getBonus,
  computeNextClaim,
};
