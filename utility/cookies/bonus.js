require("dotenv").config();

const { sassTrue } = require("sass");
const Database = require("../database");

async function setBonus({ userID, reward, count, streak, date}) {
  let DB = new Database();
  try {
    let result = await DB.query(
      "INSERT INTO `bonus`(`userID`, `reward`, `count`, `streak`, `date`) VALUES (?, ?, ?, ?, ?);",
      [userID, reward, count, streak, date]
    );
    // console.log(result);
    return {
      status: result.success,
      ID: userID,
    };
  } catch (error) {
    console.log(error);
    return {
      status: result.success,
      ID: userID,
    };
  }
}
async function claimBonus({ ID }) {
  let DB = new Database();
  // checking if user exist
  let isActive = await isUserActive(ID);
  let { userID, reward, count, streak, date, day, status } =
    await isBonusClaimed(ID);

  if (isActive) {
    try {
      let result = await DB.query(
        "UPDATE `bonus` SET `reward`= ?,`count`= ?,`streak`= ?,`date`= ? WHERE `userID`= ?",
        [reward, count, streak, date, userID]
      );
      result = await DB.query("SELECT * FROM `bonus` WHERE `userID` = ?", [
        userID,
      ]);
      result = JSON.parse(JSON.stringify(result.results));
      result = result[0]
      return {
        result,
        status: true,
        ID,
      };
    } catch (error) {
      console.log(error);
      return {
        result,
        status: false,
        ID,
      };
    }
  } else {
    let isUserSet = await setBonus({ userID, reward, count, streak, date});
    // console.log(isUserSet);
    return isUserSet;
  }
  return newRecord;
}

async function isBonusClaimed(userID) {
  let DB = new Database();
  let now = new Date();
  let result;
  let nextClaim;
  let currentTime = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(
    "-"
  );

  console.log(await isUserActive(userID), ">> active");
  // check if user is active
  if (isUserActive(userID)) {
    try {
      result = await DB.query("SELECT * FROM `bonus` WHERE userID = ?", [
        userID,
      ]);
      result = JSON.parse(JSON.stringify(result.results))[0];
      console.log(result);
      let T = result.date.split(":")[0].split("T")[1];
      T = Number(T);
      // console.log(T);
      result.date = result.date.split("T")[0];
      let lastClaimed = result.date.split("-").map((d) => Number(d));

      // modify Day
      lastClaimed[2] = T == 23 ? lastClaimed[2] + 1 : lastClaimed[2];
      result.date = lastClaimed;
      const [year, month, day] = lastClaimed; // assumed format: [YYYY, MM, DD]

      console.log(T, "T >>>");
      console.log(lastClaimed);

      console.log(currentTime, ">>>>> current time <<<<");

      // If the last claimed date is not today, return false (not claimed yet)
      if (
        year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1) ||
        (year === now.getFullYear() &&
          month === now.getMonth() + 1 &&
          day < now.getDate())
      ) {
        nextClaim = await setNextClaim(result, currentTime);
        nextClaim.status = false; // Not claimed today
        // console.log(">>>>", nextClaim, "<<<");
        return nextClaim;
      }

      nextClaim = await setNextClaim(result, currentTime);
      nextClaim.status = true; // Already claimed today
      return nextClaim;
    } catch (error) {
      console.log("smile");
      nextClaim = {
        userID,
        reward: process.env.AMOUNT,
        count: 1,
        streak: 1,
        date: currentTime,
        day: 1,
        status: false,
      };
      // console.log(">>>>", nextClaim, "<<<");
      return nextClaim;
      // return false; // Not claimed today
    }
  } else {
    console.log("smile");
    nextClaim = {
      userID,
      reward: process.env.AMOUNT,
      count: 1,
      streak: 1,
      date: currentTime,
      day: 1,
      status: false,
    };
    // console.log(">>>>", nextClaim, "<<<");
    return nextClaim;
    // return false; // Not claimed today
  }
}
async function isUserActive(userID) {
  let DB = new Database();
  try {
    let result = await DB.query("SELECT * FROM `bonus` WHERE `userID` = ?", [
      userID,
    ]);
    result = JSON.parse(JSON.stringify(result.results));
    return result.length != 0 ? true : false;
  } catch (error) {
    console.log(error);
  }
}
async function setNextClaim({ userID, reward, count, streak, date }, now) {
  let nextClaim = {
    userID,
    reward: process.env.AMOUNT,
    count,
    streak,
    date,
  };

  // console.log(typeof process.env.AMOUNT, "<<<<< data type <<<<<");

  // let modifyDate = date.split("-").map((d) => Number(d));
  let modifyNow = now.split("-").map((d) => Number(d));
  let onTrack = date[2] + 1 == modifyNow[2] ? true : false;
  console.log(now, "current time");
  let multiplier = 1;
  // if on  track is true increase count plus 1
  if (onTrack) {
    nextClaim.count = nextClaim.count + 1;
    // increase streak if is greater than streak
    if (nextClaim.count > nextClaim.streak) {
      nextClaim.streak = nextClaim.count;
    }
  } else {
    nextClaim.count = 1;
  }
  multiplier = nextClaim.count % 7 == 0 ? 7 : nextClaim.count % 7;
  nextClaim.reward = reward + (nextClaim.reward * multiplier);
  nextClaim.day = multiplier;
  // console.log(now, "current time");
  nextClaim.date = now;
  return nextClaim;
}
module.exports = {
  setBonus,
  isBonusClaimed,
  isUserActive,
  claimBonus,
};
